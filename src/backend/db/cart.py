from flask import g as g
import json
from .. import app, auth

    
db = g.db
class Cart(db.Model):
    __tablename__ = "cart"
    
    id = db.Column(db.Integer)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    cart = db.Column(db.String())
    status = db.Column(db.String())
 
    def __init__(self, id, user_id):
        self.id = id
        self.user_id = user_id
        self.cart = ""
        self.status = "active"

    def __repr__(self):
        return f"<Cart of User {self.id}>"
        
@app.app.route("/data/cart/get/<int:user_id>", methods=['GET'])
def get_cart(user_id):
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 400
    else:
        cart = db.get_or_404(Cart, user_id)
        return jsonify(cart)
        
@app.app.route("/data/cart/add/<int:user_id>", methods=['POST'])
def add_to_cart(user_id):
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 400
    else:
        cart = Cart.query.filter_by(user_id=user_id, status="active").first()
        if not cart:
            id = Cart.query.order_by(Cart.id.desc()).first().id + 1
            cart = Cart(id, user_id)
        items = json.loads(cart.cart)
        setattr(items, request.json['item'], request.json['amount'])
        cart.cart = json.dumps(items)
        return 'Success', 200
        
@app.app.route("/data/cart/change_amount/<int:user_id>", methods=['POST'])
def change_amount(user_id):
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 400
    else:
        cart = Cart.query.filter_by(user_id=user_id, status="active").first()
        if not cart:
            return 'No cart!', 400
        else:
            items = json.loads(cart.cart)
            setattr(items, request.json['item'], request.json['amount'])
            cart.cart = json.dumps(items)
            return 'Success', 200

    
        