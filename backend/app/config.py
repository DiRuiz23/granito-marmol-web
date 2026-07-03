import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key-taller-granito'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///taller_granito.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
