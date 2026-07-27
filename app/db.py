import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="aksjk1301",   # change this
        database="ai_gateway"  # use your existing DB name
    )