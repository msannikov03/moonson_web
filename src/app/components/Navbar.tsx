import React, { Component } from 'react';
import Link from 'next/link';
import Context from "../Context";

interface NavbarState {
    showMenu: boolean;
}

interface ContextType {
    user: { accessLevel: number } | null;
    cart: Record<string, any>;
    logout: () => void;
}

class Navbar extends Component<{}, NavbarState> {
    static contextType = Context;
    context!: ContextType;

    state: NavbarState = {
        showMenu: false,
    };

    toggleMenu = () => {
        this.setState({ showMenu: !this.state.showMenu });
    };

    render() {
        const { user, cart, logout } = this.context;

        return (
            <nav className="fixed top-0 w-full z-100 bg-black border-black dark:bg-black dark:border-black">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 md:p-2">
                    <Link href="/" passHref legacyBehavior>
                        <a className="flex items-center">
                            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white hover:-translate-y-1 transform transition duration-300">
                                Moonson
                            </span>
                        </a>
                    </Link>
                    <button
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-white rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={this.toggleMenu}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                        </svg>
                    </button>
                    <div className={`w-full md:block p-2 md:p-0 md:w-auto ${this.state.showMenu ? 'block' : 'hidden'}`}>
                        <ul className="flex flex-col font-medium border border-gray-100 rounded-lg md:flex-row md:space-x-8 md:border-0 dark:bg-gray-800 md:dark:bg-black dark:border-gray-700">
                            <li>
                                <Link href="/products" passHref legacyBehavior>
                                    <a className="block p-4 text-white md:bg-transparent md:text-white hover:bg-gray-800 rounded-full">Products</a>
                                </Link>
                            </li>
                            {user && user.accessLevel < 1 && (
                                <li>
                                    <Link href="/add-product" passHref legacyBehavior>
                                        <a className="block p-4 text-white md:bg-transparent md:text-white hover:bg-gray-800 rounded-full">Add Product</a>
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link href="/cart" passHref legacyBehavior>
                                    <a className="block p-4 text-white md:bg-transparent md:text-white hover:bg-gray-800 rounded-full">Cart
                                        <span className="inline-block bg-gray-800 rounded-full px-2 text-white">{Object.keys(cart).length}</span>
                                    </a>
                                </Link>
                            </li>
                            {!user ? (
                                <li>
                                    <Link href="/login" passHref legacyBehavior>
                                        <a className="block p-4 text-white md:bg-transparent md:text-white hover:bg-gray-800 rounded-full">Login</a>
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <Link href="/" passHref legacyBehavior>
                                        <a onClick={logout} className="block p-4 text-white md:bg-transparent md:text-white hover:bg-gray-800 rounded-full">Logout</a>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;