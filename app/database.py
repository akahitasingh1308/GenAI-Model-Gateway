from datetime import datetime
import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="aksjk1301",
        database="ai_gateway"
    )

def insert_request():
    conn = get_connection()
    cursor = conn.cursor()

    sql = """
    INSERT INTO requests
    (
        request_id,
        timestamp,
        status
    )
    VALUES
    (%s, %s, %s)
    """

    values = (
        "REQ002",
        datetime.now(),
        "success"
    )

    cursor.execute(sql, values)
    conn.commit()

    cursor.close()
    conn.close()

    print("Request inserted successfully")

if __name__ == "__main__":
    conn = get_connection()
    print("Database connected successfully!")
    conn.close()
    insert_request()















    