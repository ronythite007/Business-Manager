# db_connection.py

import mysql.connector

__cnx = None

def get_sql_connection():
    global __cnx
    if __cnx is None:
        __cnx = mysql.connector.connect(
            user='root',
            password='ronythite@007',
            host='localhost',
            database='BM'
        )
    return __cnx
