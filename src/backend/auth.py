from flask import request
from Crypto.Hash import BLAKE2s
import random


def authorized(headers):
    with open('..\\..\\src\\token.json', "r") as f:
        token = f.read()[1:-1]
    if headers.get('Authorization') == token:
        return True
    else: 
        return False
        
def generate_salt(length=64):
    return ''.join(chr(random.randint(32,126)) for i in range(length))
    
def encode_pass(password, mysalt=b''):
    salt=''
    with open('salt','r') as f:
        salt=f.read()
    if mysalt == b'':
        mysalt=str.encode(generate_salt())
    password=str.encode(salt+password)+mysalt
    for _ in range(256):
        h_obj = BLAKE2s.new(digest_bits=256)
        h_obj.update(password)
        password = h_obj.digest()
    return password, mysalt
        