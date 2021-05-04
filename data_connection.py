import os

import psycopg2


def get_connection_string():

    user_name = os.environ.get('PSQL_USERNAME')
    password = os.environ.get('PSQL_PASSWORD')
    db_name = os.environ.get('PSQL_DBNAME')
    host = os.environ.get('PSQL_HOST')
    connection_string = f"postgresql://{user_name}:{password}@{host}/{db_name}"
    env_declared = user_name and password and host and db_name
    print(connection_string)
    if env_declared:
        return connection_string
    else:
        raise KeyError('Some necessary environment variable(s) are not defined')


def open_database():
    try:
        connection_string = get_connection_string()
        connection = psycopg2.connect(connection_string)
        connection.autocommit = True
    except psycopg2.DatabaseError as exception:
        print('Database connection problem')
        raise exception
    return connection


def connection_handler(function):
    def wrapper(*args, **kwargs):
        connection = open_database()
        # we set the cursor_factory parameter to return with a RealDictCursor cursor (cursor which provide dictionaries)
        dict_cur = connection.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        ret_value = function(dict_cur, *args, **kwargs)
        dict_cur.close()
        connection.close()
        return ret_value

    return wrapper
