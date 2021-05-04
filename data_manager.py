from psycopg2.extras import RealDictCursor
from data_connection import connection_handler

from werkzeug.security import generate_password_hash, check_password_hash

@connection_handler
def create_user(cursor: RealDictCursor, form_data):
    dicted_form_data = dict(form_data)
    dicted_form_data['password'] = generate_password_hash(dicted_form_data.get('password'), method='sha256', salt_length=4)

    command = """
        INSERT INTO users (login, password)
        values (%(login)s, %(password)s); 
    """

    cursor.execute(command, dicted_form_data)


@connection_handler
def print_users(cursor: RealDictCursor):
    query = """
        SELECT * FROM users
    """

    cursor.execute(query, {})

    print(cursor.fetchall())


def validate_login(login):
    pass


def validate_user(cursor: RealDictCursor, form_data):
    dicted_object = dict(form_data)
    login = dicted_object.get('login')

    if validate_login(login):
        query = """
                SELECT * 
                FROM users
                WHERE login=%(login)s 
            """
        cursor.execute(query, {'login': login})
        user_data = cursor.fetchone()
        return check_password_hash(user_data.get('password'), dicted_object.get('password'))

    raise KeyError('No such user ==== ')


def set_session(login):
    def set_session(login, id):
        session['session_id'] = str(random.randint(0, 200)) + random.choice('abcdef')
        session['logged_user'] = login
        session['user_id'] = id
        sessions_visited_questions[session['session_id']] = []

