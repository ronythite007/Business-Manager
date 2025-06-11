# app.py

from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from db_connection import get_sql_connection
import datetime
from flask import send_file
from io import BytesIO
import pandas as pd
from xhtml2pdf import pisa
import os
from werkzeug.utils import secure_filename

from flask import send_from_directory
from flask import send_file

app = Flask(__name__)

app.secret_key = 'your_secret_key_here'  # Set a strong secret key for session management

#---------------Upload Folders---------------------------------------------------------------------------------------------------------


UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'docx', 'xlsx'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


#------------------------------------------------------------------------------------------------------------------------

def login_required(f):
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
@login_required
def index():
    
    if 'user_id' not in session:
        flash('Please log in to view your projects.', 'warning')
        return redirect(url_for('login'))
    
    search_term = request.args.get('search', '').strip()

    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)

    if search_term:
        cursor.execute("SELECT * FROM projects WHERE name LIKE %s AND user_id = %s", (f"%{search_term}%", session['user_id']))
    else:
        cursor.execute("SELECT * FROM projects WHERE user_id = %s", (session['user_id'],))

    
    projects = cursor.fetchall()
    cursor.close()

    return render_template('index.html', projects=projects, search_term=search_term)

# ------------------------------------------------------------------------------------------------------------------------

@app.route('/project/add', methods=['GET', 'POST'])
@login_required
def add_project():
    if 'user_id' not in session:
        flash('Please log in to add a project.', 'warning')
        return redirect(url_for('login'))
    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        start_date = request.form['start_date']
        end_date = request.form['end_date']
        status = request.form.get('status', 'ongoing')
        file_path = None
        file = request.files.get('file')
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            saved_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(saved_path)
            file_path = f'uploads/{filename}'
        conn = get_sql_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO projects (name, description, start_date, end_date, user_id, file_path, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (name, description, start_date, end_date, session['user_id'], file_path, status))
        conn.commit()
        cursor.close()
        return redirect(url_for('index'))
    return render_template('add_project.html')


#-----------------------------Updated for Search Query-------------------------------------------------------------------------------------------
@app.route('/project/<int:project_id>', methods=['GET'])
@login_required
def view_project(project_id):

    if 'user_id' not in session:
        flash('Please log in to view project details.', 'warning')
        return redirect(url_for('login'))
    
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM projects WHERE id = %s AND user_id = %s", (project_id, session['user_id']))
    project = cursor.fetchone()
    if not project:
        flash('You do not have permission to view this project.', 'danger')
        cursor.close()
        return redirect(url_for('index'))
    person_search = request.args.get('person', '').strip()

    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id,))
    project = cursor.fetchone()

    if person_search:
        cursor.execute("SELECT * FROM payments WHERE project_id = %s AND person_name LIKE %s", 
                       (project_id, f"%{person_search}%"))
    else:
        cursor.execute("SELECT * FROM payments WHERE project_id = %s", (project_id,))

    payments = cursor.fetchall()
    total_in = sum(p['amount'] for p in payments if p['type'] == 'IN')
    total_out = sum(p['amount'] for p in payments if p['type'] == 'OUT')
    balance = total_in - total_out

    cursor.close()
    return render_template('project_detail.html',
                           project=project,
                           payments=payments,
                           total_in=total_in,
                           total_out=total_out,
                           balance=balance,
                           person_search=person_search)

# ------------------------------------------------------------------------------------------------------------------------

@app.route('/payment/add/<int:project_id>', methods=['GET', 'POST'])
@login_required
def add_payment(project_id):
    if request.method == 'POST':
        file_path = None
        file = request.files.get('file')

        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            saved_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(saved_path)
            file_path = f'uploads/{filename}'  

        data = (
            project_id,
            request.form['type'],
            request.form['amount'],
            request.form['person_name'],
            request.form['contact_info'],
            request.form['date'],
            request.form['reason'],
            request.form['payment_method'],
            file_path
        )

        conn = get_sql_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO payments
            (project_id, type, amount, person_name, contact_info, date, reason, payment_method, file_path)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, data)
        conn.commit()
        cursor.close()
        return redirect(url_for('view_project', project_id=project_id))

    return render_template('add_payment.html', project_id=project_id)




# ------------------------------------------------------------------------------------------------------------------------

@app.route('/project/<int:project_id>/export/excel')
@login_required
def export_project_excel(project_id):
    # Ensure only the owner (user_id) can export the project
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM projects WHERE id = %s AND user_id = %s", (project_id, session['user_id']))
    project = cursor.fetchone()
    if not project:
        cursor.close()
        flash('You do not have permission to export this project.', 'danger')
        return redirect(url_for('index'))
    cursor.close()
    
    from flask import request, send_file
    import pandas as pd
    from io import BytesIO

    person = request.args.get('person', '').strip()

    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id,))
    project = cursor.fetchone()

    if person:
        cursor.execute("SELECT * FROM payments WHERE project_id = %s AND person_name LIKE %s",
                       (project_id, f"%{person}%"))
    else:
        cursor.execute("SELECT * FROM payments WHERE project_id = %s", (project_id,))
    payments = cursor.fetchall()
    cursor.close()

    df = pd.DataFrame(payments)
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Payments')
    output.seek(0)

    return send_file(output,
                     as_attachment=True,
                     download_name=f"{project['name']}_payments.xlsx",
                     mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')



@app.route('/project/<int:project_id>/export/pdf')
def export_project_pdf(project_id):

    # Ensure only the owner (user_id) can export the project
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM projects WHERE id = %s AND user_id = %s", (project_id, session['user_id']))
    project = cursor.fetchone()
    if not project:
        cursor.close()
        flash('You do not have permission to export this project.', 'danger')
        return redirect(url_for('index'))
    cursor.close()

    person = request.args.get('person', '').strip()

    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id,))
    project = cursor.fetchone()

    if person:
        cursor.execute("SELECT * FROM payments WHERE project_id = %s AND person_name LIKE %s",
                       (project_id, f"%{person}%"))
    else:
        cursor.execute("SELECT * FROM payments WHERE project_id = %s", (project_id,))
    payments = cursor.fetchall()
    cursor.close()

    html = render_template('export_pdf_template.html', project=project, payments=payments)
    pdf_file = BytesIO()
    pisa.CreatePDF(BytesIO(html.encode("utf-8")), dest=pdf_file)

    pdf_file.seek(0)
    return send_file(pdf_file,
                     as_attachment=True,
                     download_name=f"{project['name']}_payments.pdf",
                     mimetype='application/pdf')

#------------------------------------------------------------------------------------------------------------------------
@app.route('/project/edit/<int:project_id>', methods=['GET', 'POST'])
@login_required
def edit_project(project_id):
    # Ensure only the owner (user_id) can edit the project
    if 'user_id' not in session:
        flash('Please log in to edit a project.', 'warning')
        return redirect(url_for('login'))
    
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM projects WHERE id = %s AND user_id = %s", (project_id, session['user_id']))
    project = cursor.fetchone()
    if not project:
        cursor.close()
        flash('You do not have permission to edit this project.', 'danger')
        return redirect(url_for('index'))
    # No need to re-open connection, reuse above

    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        start_date = request.form['start_date']
        end_date = request.form['end_date']
        status = request.form.get('status', 'ongoing')
        old_file_path = project.get('file_path')
        file_path = old_file_path

        # Handle new file upload
        file = request.files.get('file')
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            saved_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(saved_path)
            file_path = f'uploads/{filename}'
            # Remove old file if exists
            if old_file_path and os.path.exists(old_file_path.replace('uploads/', app.config['UPLOAD_FOLDER'] + os.sep)):
                try:
                    os.remove(old_file_path.replace('uploads/', app.config['UPLOAD_FOLDER'] + os.sep))
                except Exception:
                    pass
        # Handle file deletion
        elif request.form.get('delete_file') == 'yes':
            if old_file_path and os.path.exists(old_file_path.replace('uploads/', app.config['UPLOAD_FOLDER'] + os.sep)):
                try:
                    os.remove(old_file_path.replace('uploads/', app.config['UPLOAD_FOLDER'] + os.sep))
                except Exception:
                    pass
            file_path = None

        cursor.execute("""
            UPDATE projects
            SET name = %s, description = %s, start_date = %s, end_date = %s, file_path = %s, status = %s
            WHERE id = %s
        """, (name, description, start_date, end_date, file_path, status, project_id))
        conn.commit()
        cursor.close()
        return redirect(url_for('view_project', project_id=project_id))

    # GET request
    cursor.execute("SELECT * FROM projects WHERE id = %s", (project_id,))
    project = cursor.fetchone()
    cursor.close()
    return render_template('edit_project.html', project=project)

# ------------------------------------------------------------------------------------------------------------------------

@app.route('/project/delete/<int:project_id>')
@login_required

def delete_project(project_id):
    if 'user_id' not in session:
        flash('Please log in to delete a project.', 'warning')
        return redirect(url_for('login'))

    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM projects WHERE id = %s AND user_id = %s", (project_id, session['user_id']))
    project = cursor.fetchone()
    if not project:
        cursor.close()
        flash('You do not have permission to delete this project.', 'danger')
        return redirect(url_for('index'))
    
    cursor.close()
    conn = get_sql_connection()
    cursor = conn.cursor()


    cursor.execute("DELETE FROM payments WHERE project_id = %s", (project_id,))
    cursor.execute("DELETE FROM projects WHERE id = %s", (project_id,))
    conn.commit()
    cursor.close()
    return redirect(url_for('index'))

#------------------------------------------------------------------------------------------------------------------------

@app.route('/payment/edit/<int:payment_id>', methods=['GET', 'POST'])
@login_required

def edit_payment(payment_id):
    # Ensure only the owner (user_id) can edit the payment (and thus add payments only to their own projects)
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT p.user_id
        FROM payments pay
        JOIN projects p ON pay.project_id = p.id
        WHERE pay.id = %s
    """, (payment_id,))
    result = cursor.fetchone()
    if not result or result['user_id'] != session.get('user_id'):
        cursor.close()
        flash('You do not have permission to edit this payment.', 'danger')
        return redirect(url_for('index'))
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        cursor.execute("SELECT project_id, file_path FROM payments WHERE id = %s", (payment_id,))
        payment = cursor.fetchone()
        project_id = payment['project_id']
        old_file_path = payment['file_path']
        file_path = old_file_path

        # Handle new file upload
        file = request.files.get('file')
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            saved_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(saved_path)
            file_path = f'uploads/{filename}'

            # Remove old file
            if old_file_path and os.path.exists(old_file_path):
                try:
                    os.remove(old_file_path)
                except:
                    pass

        # Handle file deletion
        elif request.form.get('delete_file') == 'yes':
            if old_file_path and os.path.exists(old_file_path):
                try:
                    os.remove(old_file_path)
                except:
                    pass
            file_path = None  # Remove from DB

        data = (
            request.form['type'],
            request.form['amount'],
            request.form['person_name'],
            request.form['contact_info'],
            request.form['date'],
            request.form['reason'],
            request.form['payment_method'],
            file_path,
            payment_id
        )

        cursor.execute("""
            UPDATE payments
            SET type=%s, amount=%s, person_name=%s, contact_info=%s, date=%s,
                reason=%s, payment_method=%s, file_path=%s
            WHERE id=%s
        """, data)
        conn.commit()
        cursor.close()
        return redirect(url_for('view_project', project_id=project_id))

    # GET request
    cursor.execute("SELECT * FROM payments WHERE id = %s", (payment_id,))
    payment = cursor.fetchone()
    cursor.close()
    return render_template('edit_payment.html', payment=payment)



#------------------------------------------------------------------------------------------------------------------------

@app.route('/uploads/<path:filename>')
@login_required
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

#-----------------Dashboard-------------------------------------------------------------------------------------------------------

# @app.route('/dashboard')
# def dashboard():
#     conn = get_sql_connection()
#     cursor = conn.cursor(dictionary=True)

#     # Get total IN and OUT
#     cursor.execute("SELECT type, SUM(amount) as total FROM payments GROUP BY type")
#     in_out_data = cursor.fetchall()

#     # Monthly transaction volume
#     cursor.execute("""
#         SELECT DATE_FORMAT(date, '%Y-%m') as month, COUNT(*) as count
#         FROM payments
#         GROUP BY month
#         ORDER BY month
#     """)
#     monthly_volume = cursor.fetchall()

#     # Cash flow over time (net IN - OUT)
#     cursor.execute("""
#         SELECT DATE_FORMAT(date, '%Y-%m') as month,
#                SUM(CASE WHEN type='IN' THEN amount ELSE 0 END) as total_in,
#                SUM(CASE WHEN type='OUT' THEN amount ELSE 0 END) as total_out
#         FROM payments
#         GROUP BY month
#         ORDER BY month
#     """)
#     cash_flow = cursor.fetchall()

#     # Project-wise IN/OUT
#     cursor.execute("""
#         SELECT p.name as project_name,
#                SUM(CASE WHEN pay.type='IN' THEN pay.amount ELSE 0 END) as total_in,
#                SUM(CASE WHEN pay.type='OUT' THEN pay.amount ELSE 0 END) as total_out
#         FROM payments pay
#         JOIN projects p ON pay.project_id = p.id
#         GROUP BY pay.project_id
#     """)
#     project_totals = cursor.fetchall()

#     cursor.close()

#     return render_template('dashboard.html',
#                            in_out_data=in_out_data,
#                            monthly_volume=monthly_volume,
#                            cash_flow=cash_flow,
#                            project_totals=project_totals)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = get_sql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        existing_user = cursor.fetchone()
        if existing_user:
            flash('Username already exists.', 'danger')
            return render_template('register.html')
        password_hash = generate_password_hash(password)
        cursor.execute('INSERT INTO users (username, password_hash) VALUES (%s, %s)', (username, password_hash))
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
        # Log the user in and redirect to business details
        session['user_id'] = user_id
        session['username'] = username
        flash('Registration successful! Please enter your business details.', 'success')
        return redirect(url_for('business_details'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        conn = get_sql_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
        user = cursor.fetchone()
        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['username'] = user['username']
            # Check if business details exist
            cursor.execute('SELECT * FROM business_details WHERE user_id = %s', (user['id'],))
            details = cursor.fetchone()
            cursor.close()
            flash('Login successful!', 'success')
            if not details:
                flash('Please enter your business details to continue.', 'info')
                return redirect(url_for('business_details'))
            return redirect(url_for('index'))
        else:
            cursor.close()
            flash('Invalid username or password.', 'danger')
    return render_template('login.html')



@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully.', 'info')
    return redirect(url_for('login'))

@app.route('/payment/delete/<int:payment_id>')
@login_required

def delete_payment(payment_id):
    # Ensure only the owner (user_id) can delete the payment
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT pay.project_id, p.user_id
        FROM payments pay
        JOIN projects p ON pay.project_id = p.id
        WHERE pay.id = %s
    ''', (payment_id,))
    result = cursor.fetchone()
    if not result or result['user_id'] != session.get('user_id'):
        cursor.close()
        flash('You do not have permission to delete this payment.', 'danger')
        return redirect(url_for('index'))
    project_id = result['project_id']
    # Now delete the payment
    cursor.execute('DELETE FROM payments WHERE id = %s', (payment_id,))
    conn.commit()
    cursor.close()
    flash('Payment deleted successfully.', 'success')
    return redirect(url_for('view_project', project_id=project_id))

@app.route('/business-details', methods=['GET', 'POST'])
@login_required
def business_details():
    user_id = session['user_id']
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)

    if request.method == 'POST':
        business_name = request.form['business_name']
        address = request.form['address']
        phone = request.form['phone']
        email = request.form['email']

        # Check if already exists
        cursor.execute('SELECT * FROM business_details WHERE user_id = %s', (user_id,))
        existing = cursor.fetchone()

        if existing:
            cursor.execute('''
                UPDATE business_details 
                SET business_name = %s, address = %s, phone = %s, email = %s 
                WHERE user_id = %s
            ''', (business_name, address, phone, email, user_id))
        else:
            cursor.execute('''
                INSERT INTO business_details (user_id, business_name, address, phone, email)
                VALUES (%s, %s, %s, %s, %s)
            ''', (user_id, business_name, address, phone, email))

        conn.commit()
        cursor.close()
        flash('Business details saved!', 'success')
        return redirect(url_for('index'))

    # GET: show form with existing data if present
    cursor.execute('SELECT * FROM business_details WHERE user_id = %s', (user_id,))
    details = cursor.fetchone()
    cursor.close()
    return render_template('business_details.html', details=details)

if __name__ == '__main__':
    app.run(debug=True)
