import React, { Component } from "react";
import { withRouter, NextRouter } from "next/router";
import axios from "axios";
import { WithRouterProps } from "next/dist/client/with-router";
import withContext from "../context/withContext";

interface ProductState {
  name: string;
  price: string;
  stock: string;
  shortDesc: string;
  description: string;
  flash?: { status: string; msg: string };
  error?: string;
}

interface AddProductProps extends WithRouterProps {
  context: {
    user: { accessLevel: number };
    addProduct: (product: Partial<ProductState>, callback: () => void) => void;
  };
}

const initState: ProductState = {
  name: "",
  price: "",
  stock: "",
  shortDesc: "",
  description: "",
};

class AddProduct extends Component<AddProductProps, ProductState> {
  constructor(props: AddProductProps) {
    super(props);
    this.state = initState;
  }

  save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, price, stock, shortDesc, description } = this.state;

    if (name && price) {
      const id =
        Math.random().toString(36).substring(2) + Date.now().toString(36);

      await axios.post("http://localhost:3001/products", {
        id,
        name,
        price,
        stock,
        shortDesc,
        description,
      });

      this.props.context.addProduct(
        {
          name,
          price,
          shortDesc,
          description,
          stock: stock ? String(stock) : "0",
        },
        () => this.setState(initState)
      );
      this.setState({
        flash: { status: "is-success", msg: "Product created successfully" },
      });
    } else {
      this.setState({
        flash: { status: "is-danger", msg: "Please enter name and price" },
      });
    }
  };

  handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value,
      error: "",
    });
  };

  render() {
    const { name, price, stock, shortDesc, description } = this.state;
    const { user } = this.props.context;

    if (!(user && user.accessLevel < 1)) {
      this.props.router.push("/");
      return null;
    }

    return (
      <>
        <div className="hero is-black">
          <div className="hero-body container">
            <h4 className="title">Add Product</h4>
          </div>
        </div>
        <br />
        <br />
        <form onSubmit={this.save}>
          <div className="columns is-mobile is-centered">
            <div className="column is-one-third">
              <div className="field">
                <label className="label" htmlFor="name">
                  Product Name:
                </label>
                <input
                  id="name"
                  className="input"
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="price">
                  Price:
                </label>
                <input
                  id="price"
                  className="input"
                  type="number"
                  name="price"
                  value={this.state.price}
                  onChange={this.handleChange}
                  required
                  placeholder="Enter product price"
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="stock">
                  Available in Stock:
                </label>
                <input
                  id="stock"
                  className="input"
                  type="number"
                  name="stock"
                  value={this.state.stock}
                  onChange={this.handleChange}
                  placeholder="Enter stock quantity"
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="shortDesc">
                  Short Description:
                </label>
                <input
                  id="shortDesc"
                  className="input"
                  type="text"
                  name="shortDesc"
                  value={this.state.shortDesc}
                  onChange={this.handleChange}
                  placeholder="Enter short description"
                />
              </div>
              <div className="field">
                <label className="label" htmlFor="description">
                  Description:
                </label>
                <textarea
                  id="description"
                  className="textarea no-resize"
                  rows={2}
                  name="description"
                  value={this.state.description}
                  onChange={this.handleChange}
                  placeholder="Enter product description"
                />
              </div>
              {this.state.flash && (
                <div className={`notification ${this.state.flash.status}`}>
                  {this.state.flash.msg}
                </div>
              )}
              <div className="field is-clearfix">
                <button
                  className="button is-primary is-outlined is-pulled-right"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </>
    );
  }
}

export default withRouter(withContext(AddProduct));
