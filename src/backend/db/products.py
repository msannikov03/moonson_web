import random, string
from datetime import datetime
from flask import g, request, jsonify
from .. import app, auth
    
    
db = g.db
class Products(db.Model):
    __tablename__ = "products"
 
    id = db.Column(db.String(), primary_key=True)
    name = db.Column(db.String())
    stock = db.Column(db.Integer)
    price = db.Column(db.Numeric(5,2)) # 99999.99
    shortdesc = db.Column(db.String())
    imagesrc = db.Column(db.String())
    description = db.Column(db.String())
 
    def __init__(self, dict): #name:str, stock: int, price: float, shortdesc:str="", imagesrc:str="https://bulma.io/images/placeholders/256x256.png", description:str=""):
        self.name = dict['name']
        self.id =  ''.join([random.choice(string.ascii_letters + string.digits) for i in range(6)]) + str(datetime.timestamp(datetime.now()))
        self.stock = dict['stock']
        self.price = dict['price']
        self.shortdesc = dict['shortdesc'] if 'shortdesc' in dict else ''
        self.imagesrc = dict['imagesrc'] if 'imagesrc' in dict else "https://bulma.io/images/placeholders/256x256.png"
        self.description = dict['description'] if 'description' in dict else ''

    def __repr__(self):
        return f"<Product {self.name[:20]} ({self.id})>"
        
@app.app.route("/data/products/get/", methods=['GET'])
def get_all_products():
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 400
    else:
        products = db.session.execute(db.select(Products).order_by(Products.stock)).all()
        return jsonify(products)
        
@app.app.route("/data/products/get/<int:id>", methods=['GET'])
def get_product(id):
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 400
    else:
        product = db.get_or_404(Products, id)
        return jsonify(product)
        
@app.app.route("/data/products/add/", methods=['POST'])
def add_product():
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 400
    else:
        try:
            pro = Products(request.json)
            db.session.add(pro)
            db.session.commit()
        except Exception as e:
            print(e)
            return e, 400
        
@app.app.route("/data/products/edit/", methods=['POST'])
def edit_product():
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 400
    else:
        try:
            pro = Products.query.filter_by(id=request.json['id']).first()
            for key in request.json:
                if key != 'id':
                    try:
                        setattr(pro, key, request.json[key])
                    except Exception as e:
                        print(e)
            db.session.commit()
        except Exception as e:
            print(e)
            return e, 400
            
@app.app.route("/data/products/delete/", methods=['POST'])
def delete_product():
    if not auth.authorized(request.headers):
        print('denied')
        return 'Access denied', 400
    else:
        try:
            pro = Products.query.filter_by(id=request.json['id']).first()
            db.session.delete(pro)
            db.session.commit()
        except Exception as e:
            print(e)
            return e, 400
            