# app.py

from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from flask_cors import CORS
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
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, set_access_cookies, set_refresh_cookies,
    unset_jwt_cookies
)
from datetime import timedelta
from markupsafe import Markup
from urllib.parse import quote_plus


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.secret_key = 'your_secret_key_here'  # Set a strong secret key for session management

# JWT Configuration
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key_here'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/token/refresh'
app.config['JWT_COOKIE_SECURE'] = False  # Set to True in production (HTTPS)
app.config['JWT_COOKIE_HTTPONLY'] = True
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)

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

    # Calculate total_in and total_out for each project, and ensure all are float for template math
    from decimal import Decimal
    for project in projects:
        cursor2 = conn.cursor(dictionary=True)
        cursor2.execute("SELECT type, SUM(amount) as total FROM payments WHERE project_id = %s GROUP BY type", (project['id'],))
        sums = {row['type']: float(row['total']) for row in cursor2.fetchall()}
        project['total_in'] = float(sums.get('IN', 0))
        project['total_out'] = float(sums.get('OUT', 0))
        # Ensure finalized_cost is float or None
        if project.get('finalized_cost') is not None:
            try:
                project['finalized_cost'] = float(project['finalized_cost'])
            except Exception:
                project['finalized_cost'] = None
        cursor2.close()

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
        finalized_cost = request.form.get('finalized_cost')
        finalized_cost = float(finalized_cost) if finalized_cost else None
        conn = get_sql_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO projects (name, description, start_date, end_date, user_id, file_path, status, finalized_cost)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (name, description, start_date, end_date, session['user_id'], file_path, status, finalized_cost))
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

    # Filters
    person_search = request.args.get('person', '').strip()
    type_filter = request.args.get('type_filter', '').strip()
    method_filter = request.args.get('method_filter', '').strip()

    query = "SELECT * FROM payments WHERE project_id = %s"
    params = [project_id]

    if person_search:
        query += " AND person_name LIKE %s"
        params.append(f"%{person_search}%")
    if type_filter:
        query += " AND type = %s"
        params.append(type_filter)
    if method_filter:
        query += " AND payment_method = %s"
        params.append(method_filter)

    cursor.execute(query, tuple(params))
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
                           person_search=person_search,
                           type_filter=type_filter,
                           method_filter=method_filter)

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
        payment_id = cursor.lastrowid
        conn.commit()
        cursor.close()
        # AJAX: return receipt HTML, PDF URL, WhatsApp URL
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return redirect(url_for('payment_receipt', payment_id=payment_id))
        return redirect(url_for('view_project', project_id=project_id))
    return render_template('add_payment.html', project_id=project_id)

@app.route('/payment/<int:payment_id>/receipt')
@login_required
def payment_receipt(payment_id):
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    # Get payment
    cursor.execute("SELECT * FROM payments WHERE id = %s", (payment_id,))
    payment = cursor.fetchone()
    if not payment:
        cursor.close()
        return "Payment not found", 404
    # Get project
    cursor.execute("SELECT * FROM projects WHERE id = %s", (payment['project_id'],))
    project = cursor.fetchone()
    # Get business details
    cursor.execute("SELECT * FROM business_details WHERE user_id = %s", (session['user_id'],))
    business = cursor.fetchone()
    cursor.close()
    # WhatsApp message (plain, simple, no emoji, no bold, no separators)
    wa_msg = (
        f"PAYMENT RECEIPT%0A"
        f"BUSINESS: {business['business_name']}%0A"
        f"ADDRESS: {business['address']}%0A"
        f"PHONE: {business['phone']}%0A"
        f"EMAIL: {business['email']}%0A"
        f"PROJECT: {project['name']}%0A"
        f"DESCRIPTION: {project['description']}%0A"
        f"PAYMENT TYPE: {payment['type']}%0A"
        f"AMOUNT: ₹{payment['amount']:.2f}%0A"
        f"PERSON: {payment['person_name']}%0A"
        f"CONTACT: {payment['contact_info']}%0A"
        f"DATE: {payment['date']}%0A"
        f"REASON: {payment['reason']}%0A"
        f"METHOD: {payment['payment_method']}%0A"
        f"Sent from InOutBook App"
    )
    wa_url = f"https://wa.me/?text={wa_msg}"
    # Render HTML for modal
    html = render_template('payment_receipt.html', payment=payment, project=project, business=business, now=datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), pdf_only=False)
    # If PDF requested
    if request.args.get('pdf') == '1':
        pdf_html = render_template('payment_receipt.html', payment=payment, project=project, business=business, now=datetime.datetime.now().strftime('%Y-%m-%d %H:%M'), pdf_only=True)
        pdf_file = BytesIO()
        pisa.CreatePDF(BytesIO(pdf_html.encode("utf-8")), dest=pdf_file)
        pdf_file.seek(0)
        return send_file(pdf_file, as_attachment=True, download_name=f"payment_{payment_id}_receipt.pdf", mimetype='application/pdf')
    # Otherwise, return HTML and WhatsApp URL
    return jsonify({
        'receipt_html': html,
        'pdf_url': url_for('payment_receipt', payment_id=payment_id, pdf=1),
        'whatsapp_url': wa_url
    })

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
@login_required
def export_project_pdf(project_id):
    user_id = session['user_id']
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)

    # Ownership check
    cursor.execute("SELECT * FROM projects WHERE id = %s AND user_id = %s", (project_id, user_id))
    project = cursor.fetchone()
    if not project:
        cursor.close()
        flash('You do not have permission to export this project.', 'danger')
        return redirect(url_for('index'))

    # Get payments
    person = request.args.get('person', '').strip()
    if person:
        cursor.execute("SELECT * FROM payments WHERE project_id = %s AND person_name LIKE %s",
                       (project_id, f"%{person}%"))
    else:
        cursor.execute("SELECT * FROM payments WHERE project_id = %s", (project_id,))
    payments = cursor.fetchall()

    # Get business details
    cursor.execute("SELECT business_name, address, phone, email, logo FROM business_details WHERE user_id = %s", (user_id,))
    business = cursor.fetchone()
    logo_path = business['logo'] if business and business['logo'] else None

    cursor.close()

    # Full path to logo (required for PDF rendering engines)
    if logo_path:
        logo_path = os.path.join('static', logo_path.split('static/')[-1])

    # Render HTML
    html = render_template('export_pdf_template.html',
                           project=project,
                           payments=payments,
                           business=business,
                           logo_path=logo_path)

    pdf_file = BytesIO()
    pisa.CreatePDF(BytesIO(html.encode("utf-8")), dest=pdf_file)
    pdf_file.seek(0)

    return send_file(pdf_file,
                     as_attachment=True,
                     download_name=f"{project['name']}_report.pdf",
                     mimetype='application/pdf')
# ------------------------------------------------------------------------------------------------------------------------
@app.route('/project/<int:project_id>/export/html')
@login_required
def view_project_html_report(project_id):
    user_id = session['user_id']
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)

    # Ownership check
    cursor.execute("SELECT * FROM projects WHERE id = %s AND user_id = %s", (project_id, user_id))
    project = cursor.fetchone()
    if not project:
        cursor.close()
        flash('You do not have permission to view this project.', 'danger')
        return redirect(url_for('index'))

    # Get payments
    person = request.args.get('person', '').strip()
    if person:
        cursor.execute("SELECT * FROM payments WHERE project_id = %s AND person_name LIKE %s",
                       (project_id, f"%{person}%"))
    else:
        cursor.execute("SELECT * FROM payments WHERE project_id = %s", (project_id,))
    payments = cursor.fetchall()

    # Get business details
    cursor.execute("SELECT business_name, address, phone, email, logo FROM business_details WHERE user_id = %s", (user_id,))
    business = cursor.fetchone()
    logo_path = business['logo'] if business and business['logo'] else None
    cursor.close()

    # Prepare logo path for HTML (web preview)
    if logo_path:
        logo_path = url_for('static', filename=logo_path.split('static/')[-1])

    return render_template('export_pdf_template.html',
                           project=project,
                           payments=payments,
                           business=business,
                           logo_path=logo_path)

#------------------------------------------------------------------------------------------------------------------------
@app.route('/project/edit/<int:project_id>', methods=['GET', 'POST'])
@login_required
def edit_project(project_id):
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

    if request.method == 'POST':
        name = request.form['name']
        description = request.form['description']
        start_date = request.form['start_date']
        end_date = request.form['end_date']
        status = request.form.get('status', 'ongoing')
        old_file_path = project.get('file_path')
        file_path = old_file_path

        print("DEBUG: Received form data")
        print(f"Name: {name}, Start Date: {start_date}, End Date: {end_date}")
        print("Old file path:", old_file_path)

        file = request.files.get('file')
        if file and file.filename:
            if not allowed_file(file.filename):
                flash('Invalid file type.', 'danger')
                print("ERROR: Invalid file type -", file.filename)
                cursor.close()
                return redirect(request.url)

            print("DEBUG: File received:", file.filename)
            filename = secure_filename(file.filename)
            saved_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(saved_path)
            file_path = f'uploads/{filename}'

            # Remove old file
            if old_file_path and os.path.exists(old_file_path.replace('uploads/', app.config['UPLOAD_FOLDER'] + os.sep)):
                try:
                    os.remove(old_file_path.replace('uploads/', app.config['UPLOAD_FOLDER'] + os.sep))
                    print("DEBUG: Old file removed:", old_file_path)
                except Exception as e:
                    print("WARNING: Failed to remove old file:", e)
                    
        # Handle file deletion
        elif request.form.get('delete_file') == 'yes':
            if old_file_path and os.path.exists(old_file_path.replace('uploads/', app.config['UPLOAD_FOLDER'] + os.sep)):
                try:
                    os.remove(old_file_path.replace('uploads/', app.config['UPLOAD_FOLDER'] + os.sep))
                except Exception:
                    pass
            file_path = None

        finalized_cost = request.form.get('finalized_cost')
        finalized_cost = float(finalized_cost) if finalized_cost else None

        print("Final file path to save:", file_path)

        cursor.execute("""
            UPDATE projects
            SET name = %s, description = %s, start_date = %s, end_date = %s, file_path = %s, status = %s, finalized_cost = %s
            WHERE id = %s
        """, (name, description, start_date, end_date, file_path, status, finalized_cost, project_id))

        conn.commit()
        cursor.close()
        print("DEBUG: Project updated successfully.")
        return redirect(url_for('index'))

    # GET
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

@app.route('/dashboard')
@login_required
def dashboard():
    user_id = session['user_id']
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)

    # Total IN and OUT (all projects)
    cursor.execute("SELECT type, SUM(amount) as total FROM payments WHERE project_id IN (SELECT id FROM projects WHERE user_id = %s) GROUP BY type", (user_id,))
    sums = {row['type']: float(row['total']) for row in cursor.fetchall()}
    total_in = sums.get('IN', 0)
    total_out = sums.get('OUT', 0)
    balance = total_in - total_out

    # Agreed cost (sum of finalized_cost for all projects)
    cursor.execute("SELECT SUM(finalized_cost) as agreed_cost FROM projects WHERE user_id = %s", (user_id,))
    agreed_cost = cursor.fetchone()['agreed_cost'] or 0
    agreed_cost = float(agreed_cost)

    # Profit/Loss (income - expense)
    profit_loss = total_in - total_out

    # Monthly income/expense/profit (last 12 months)
    cursor.execute("""
        SELECT DATE_FORMAT(date, '%Y-%m') as month, 
               SUM(CASE WHEN type='IN' THEN amount ELSE 0 END) as income,
               SUM(CASE WHEN type='OUT' THEN amount ELSE 0 END) as expense
        FROM payments 
        WHERE project_id IN (SELECT id FROM projects WHERE user_id = %s)
        GROUP BY month ORDER BY month DESC LIMIT 12
    """, (user_id,))
    rows = cursor.fetchall()
    months = [row['month'] for row in reversed(rows)]
    monthly_income = [float(row['income']) for row in reversed(rows)]
    monthly_expense = [float(row['expense']) for row in reversed(rows)]
    monthly_profit = [float(row['income']) - float(row['expense']) for row in reversed(rows)]

    # Cumulative balance over time
    cumulative_balance = []
    running = 0
    for i in range(len(monthly_income)):
        running += monthly_income[i] - monthly_expense[i]
        cumulative_balance.append(running)

    # Category-wise expense (top 5)
    cursor.execute("""
        SELECT reason as category, SUM(amount) as total 
        FROM payments 
        WHERE type='OUT' AND project_id IN (SELECT id FROM projects WHERE user_id = %s)
        GROUP BY reason ORDER BY total DESC LIMIT 5
    """, (user_id,))
    cat_rows = cursor.fetchall()
    category_labels = [row['category'] for row in cat_rows]
    category_expense = [float(row['total']) for row in cat_rows]

    # Category expense trend (stacked bar, last 6 months)
    cursor.execute("SELECT DISTINCT reason FROM payments WHERE type='OUT' AND project_id IN (SELECT id FROM projects WHERE user_id = %s)", (user_id,))
    all_categories = [row['reason'] for row in cursor.fetchall()]
    cat_trend = {cat: [] for cat in all_categories}
    for m in months[-6:]:
        cursor.execute("""
            SELECT reason, SUM(amount) as total FROM payments 
            WHERE type='OUT' AND project_id IN (SELECT id FROM projects WHERE user_id = %s) AND DATE_FORMAT(date, '%Y-%m') = %s
            GROUP BY reason
        """, (user_id, m))
        month_data = {row['reason']: float(row['total']) for row in cursor.fetchall()}
        for cat in all_categories:
            cat_trend[cat].append(month_data.get(cat, 0))
    cat_trend_labels = months[-6:]
    cat_trend_data = cat_trend

    # Project-wise income/expense (top 5 projects)
    cursor.execute("""
        SELECT p.name as project, 
               SUM(CASE WHEN pay.type='IN' THEN pay.amount ELSE 0 END) as income,
               SUM(CASE WHEN pay.type='OUT' THEN pay.amount ELSE 0 END) as expense
        FROM projects p
        LEFT JOIN payments pay ON pay.project_id = p.id
        WHERE p.user_id = %s
        GROUP BY p.id, p.name
        ORDER BY income DESC LIMIT 5
    """, (user_id,))
    proj_rows = cursor.fetchall()
    project_labels = [row['project'] for row in proj_rows]
    project_income = [float(row['income']) for row in proj_rows]
    project_expense = [float(row['expense']) for row in proj_rows]
    project_profit = [float(row['income']) - float(row['expense']) for row in proj_rows]
    project_margin = [round((float(row['income']) - float(row['expense'])) / float(row['income']) * 100, 2) if float(row['income']) > 0 else 0 for row in proj_rows]

    # Top 5 profitable projects
    top_profit_projects = sorted(
        zip(project_labels, project_profit), key=lambda x: x[1], reverse=True)[:5]
    top_profit_labels = [x[0] for x in top_profit_projects]
    top_profit_values = [x[1] for x in top_profit_projects]

    # Top vendors by expense (person_name, OUT)
    cursor.execute("""
        SELECT person_name, SUM(amount) as total FROM payments 
        WHERE type='OUT' AND project_id IN (SELECT id FROM projects WHERE user_id = %s)
        GROUP BY person_name ORDER BY total DESC LIMIT 5
    """, (user_id,))
    vendor_rows = cursor.fetchall()
    vendor_labels = [row['person_name'] for row in vendor_rows]
    vendor_expense = [float(row['total']) for row in vendor_rows]

    # Frequent transaction persons (IN+OUT count)
    cursor.execute("""
        SELECT person_name, COUNT(*) as count FROM payments 
        WHERE project_id IN (SELECT id FROM projects WHERE user_id = %s)
        GROUP BY person_name ORDER BY count DESC LIMIT 5
    """, (user_id,))
    freq_rows = cursor.fetchall()
    freq_labels = [row['person_name'] for row in freq_rows]
    freq_counts = [int(row['count']) for row in freq_rows]

    # Unpaid balances per vendor (if OUT > IN for a person)
    cursor.execute("""
        SELECT person_name, 
               SUM(CASE WHEN type='IN' THEN amount ELSE 0 END) as paid_in,
               SUM(CASE WHEN type='OUT' THEN amount ELSE 0 END) as paid_out
        FROM payments 
        WHERE project_id IN (SELECT id FROM projects WHERE user_id = %s)
        GROUP BY person_name
    """, (user_id,))
    unpaid_rows = cursor.fetchall()
    unpaid_labels = []
    unpaid_balances = []
    for row in unpaid_rows:
        unpaid = float(row['paid_out'] or 0) - float(row['paid_in'] or 0)
        if unpaid > 0:
            unpaid_labels.append(row['person_name'])
            unpaid_balances.append(unpaid)

    # AI insight placeholder
    ai_insight = "Your business dashboard is up to date!"

    cursor.close()
    return render_template(
        'dashboard.html',
        total_in=total_in,
        total_out=total_out,
        balance=balance,
        agreed_cost=agreed_cost,
        profit_loss=profit_loss,
        ai_insight=ai_insight,
        months=months,
        monthly_income=monthly_income,
        monthly_expense=monthly_expense,
        monthly_profit=monthly_profit,
        cumulative_balance=cumulative_balance,
        category_labels=category_labels,
        category_expense=category_expense,
        cat_trend_labels=cat_trend_labels,
        cat_trend_data=cat_trend_data,
        project_labels=project_labels,
        project_income=project_income,
        project_expense=project_expense,
        project_profit=project_profit,
        project_margin=project_margin,
        top_profit_labels=top_profit_labels,
        top_profit_values=top_profit_values,
        vendor_labels=vendor_labels,
        vendor_expense=vendor_expense,
        freq_labels=freq_labels,
        freq_counts=freq_counts,
        unpaid_labels=unpaid_labels,
        unpaid_balances=unpaid_balances
    )

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

UPLOAD_FOLDER = 'static/uploads/logos'
ALLOWED_EXTENSIONS_LOGOS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS_LOGOS

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
        logo_file = request.files.get('logo')
        logo_path = None

        # Handle file upload
        if logo_file and allowed_file(logo_file.filename):
            filename = secure_filename(f"user{user_id}_{logo_file.filename}")
            logo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            logo_file.save(logo_path)

        # Check if record exists
        cursor.execute('SELECT * FROM business_details WHERE user_id = %s', (user_id,))
        existing = cursor.fetchone()

        if existing:
            if logo_path:
                cursor.execute('''
                    UPDATE business_details 
                    SET business_name=%s, address=%s, phone=%s, email=%s, logo=%s 
                    WHERE user_id=%s
                ''', (business_name, address, phone, email, logo_path, user_id))
            else:
                cursor.execute('''
                    UPDATE business_details 
                    SET business_name=%s, address=%s, phone=%s, email=%s 
                    WHERE user_id=%s
                ''', (business_name, address, phone, email, user_id))
        else:
            cursor.execute('''
                INSERT INTO business_details (user_id, business_name, address, phone, email, logo)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (user_id, business_name, address, phone, email, logo_path))

        conn.commit()
        cursor.close()
        flash('Business details saved!', 'success')
        return redirect(url_for('index'))

    # GET request: load existing details
    cursor.execute('SELECT * FROM business_details WHERE user_id = %s', (user_id,))
    details = cursor.fetchone()
    cursor.close()
    return render_template('business_details.html', details=details)

@app.route('/workers', methods=['GET', 'POST'])
@login_required
def workers():
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    if request.method == 'POST':
        name = request.form['name']
        contact = request.form['contact']
        cursor.execute("INSERT INTO workers (user_id, name, contact) VALUES (%s, %s, %s)", (session['user_id'], name, contact))
        conn.commit()
    cursor.execute("SELECT * FROM workers WHERE user_id = %s", (session['user_id'],))
    workers = cursor.fetchall()
    cursor.close()
    return render_template('workers.html', workers=workers)

@app.route('/workers/<int:worker_id>/payments', methods=['GET', 'POST'])
@login_required
def worker_payments(worker_id):
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM workers WHERE id = %s AND user_id = %s", (worker_id, session['user_id']))
    worker = cursor.fetchone()
    if not worker:
        cursor.close()
        flash('Worker not found or access denied.', 'danger')
        return redirect(url_for('workers'))
    if request.method == 'POST':
        date = request.form.get('date')
        amount = request.form.get('amount')
        if date and amount:
            cursor.execute("INSERT INTO worker_payments (worker_id, date, amount) VALUES (%s, %s, %s)", (worker_id, date, amount))
            conn.commit()
    cursor.execute("SELECT * FROM worker_payments WHERE worker_id = %s ORDER BY date DESC", (worker_id,))
    payments = cursor.fetchall()
    cursor.close()
    return render_template('worker_payments.html', worker=worker, payments=payments)

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    user_id = session['user_id']
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    # Get user details
    cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
    user = cursor.fetchone()
    # Get business details
    cursor.execute('SELECT * FROM business_details WHERE user_id = %s', (user_id,))
    business = cursor.fetchone()
    message = None
    if request.method == 'POST':
        # Change password
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')
        if new_password or confirm_password:
            if new_password != confirm_password:
                flash('Passwords do not match.', 'danger')
            elif len(new_password) < 4:
                flash('Password must be at least 4 characters.', 'danger')
            else:
                password_hash = generate_password_hash(new_password)
                cursor.execute('UPDATE users SET password_hash = %s WHERE id = %s', (password_hash, user_id))
                conn.commit()
                flash('Password updated successfully.', 'success')
        # Update business details
        if request.form.get('update_business'):
            business_name = request.form.get('business_name')
            address = request.form.get('address')
            phone = request.form.get('phone')
            email = request.form.get('email')
            logo_file = request.files.get('logo')
            logo_path = business['logo'] if business and business.get('logo') else None
            if logo_file and logo_file.filename:
                filename = secure_filename(f"user{user_id}_" + logo_file.filename)
                logo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                logo_file.save(logo_path)
            if business:
                cursor.execute('''
                    UPDATE business_details SET business_name=%s, address=%s, phone=%s, email=%s, logo=%s WHERE user_id=%s
                ''', (business_name, address, phone, email, logo_path, user_id))
            else:
                cursor.execute('''
                    INSERT INTO business_details (user_id, business_name, address, phone, email, logo) VALUES (%s, %s, %s, %s, %s, %s)
                ''', (user_id, business_name, address, phone, email, logo_path))
            conn.commit()
            flash('Business details updated.', 'success')
        # Refresh data after update
        cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))
        user = cursor.fetchone()
        cursor.execute('SELECT * FROM business_details WHERE user_id = %s', (user_id,))
        business = cursor.fetchone()
    cursor.close()
    return render_template('profile.html', user=user, business=business)

@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE username = %s', (username,))
    user = cursor.fetchone()
    if user and check_password_hash(user['password_hash'], password):
        access_token = create_access_token(identity=user['id'])
        refresh_token = create_refresh_token(identity=user['id'])
        resp = jsonify({'login': True})
        set_access_cookies(resp, access_token)
        set_refresh_cookies(resp, refresh_token)
        return resp
    else:
        return jsonify({'login': False, 'msg': 'Invalid credentials'}), 401

@app.route('/api/token/refresh', methods=['POST'])
@jwt_required(refresh=True)
def api_token_refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    resp = jsonify({'refresh': True})
    set_access_cookies(resp, access_token)
    return resp

@app.route('/api/logout', methods=['POST'])
def api_logout():
    resp = jsonify({'logout': True})
    unset_jwt_cookies(resp)
    return resp

# Example protected API route
@app.route('/api/projects', methods=['GET'])
@jwt_required()
def api_projects():
    user_id = get_jwt_identity()
    conn = get_sql_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM projects WHERE user_id = %s', (user_id,))
    projects = cursor.fetchall()
    cursor.close()
    return jsonify(projects)

@app.route('/api/contact', methods=['POST'])
def api_contact():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    company = data.get('company')
    subject = data.get('subject')
    message = data.get('message')
    # Save to contact_messages table
    conn = get_sql_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO contact_messages (name, email, company, subject, message, created_at)
        VALUES (%s, %s, %s, %s, %s, NOW())
    """, (name, email, company, subject, message))
    conn.commit()
    cursor.close()
    return jsonify({'success': True, 'message': 'Thank you for contacting us! We will get back to you soon.'}), 200

if __name__ == '__main__':
    app.run(debug=True)
