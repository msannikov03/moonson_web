from flask import g as g
from flask import jsonify, request
from .. import app, auth


db = g.db
class Users(db.Model):
    __tablename__ = "users"
 
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String())
    password = db.Column(db.LargeBinary)
    username = db.Column(db.String())
    name = db.Column(db.String())
    surname = db.Column(db.String())
    shipping = db.Column(db.String())
    permissions = db.Column(db.Integer, default=0)
    cart = db.relationship('Cart', backref='users')
 
    def __init__(self, email, password, name, surname, id=1, permissions=0, username="", shipping=""):
        self.id = id
        self.email = email
        self.password = password
        self.permissions = permissions
        self.username = username
        self.name = name
        self.surname = surname
        self.shipping = shipping
        

    def __repr__(self):
        return f"<User {self.id} ({self.email}) with permissions {self.permissions}>"
        
@app.app.route("/data/users/get/<int:id>", methods=['GET'])
def get_user(id):
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 400
    else:
        user = db.get_or_404(Users, id)
        return jsonify(user)
        
@app.app.route("/login", methods=['POST'])
def login():
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 403
    else:
        try:
            user = Users.query.filter_by(email=request.json['email']).first()
            if user is None:
                return '10001', 204 # 'User does not exist'
            else:
                if user.password == auth.encrypt(request.json['password']):
                    print('good pass')
                    return user.__dict__, 200 # TODO: how will it work?
                else:
                    print('bad pass')
                    print(f'comparing {user.password}')
                    print(f"and {auth.encrypt(request.json['password'])}")
                    return '10002', 204 # 'Wrong credentials'
        except Exception as e:
            print(e)
            return e, 400
            
@app.app.route("/data/users/create", methods=['POST'])
def new_user():
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 400
    else:
        try:
            user = Users.query.filter_by(email=request.json['email']).first()
            if user is not None:
                return '10003', 204 # 'User exists'
            else:
                id = Users.query.order_by(Users.id.desc()).first().id + 1
                u = Users(request.json['email'], auth.encrypt(request.json['password']), request.json['name'], request.json['surname'], id)
                db.session.add(u)
                db.session.commit()
                user = Users.query.filter_by(email=request.json['email']).first()
                return user.__dict__, 200
        except Exception as e:
            print(e)
            return e, 400
       