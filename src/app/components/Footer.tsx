import React from 'react';
import Link from 'next/link';
import 'font-awesome/css/font-awesome.min.css';

const Footer: React.FC = () => {
    return (
        <div className='bg-black p-4 flex flex-col justify-center items-center'>
            <section className='max-w-full w-full'>
                <div className='flex justify-between items-center w-9/10 max-w-[1000px] mx-auto my-2'>
                    <small className='text-white mb-2'>SheesH.Ltd © 2023</small>
                    <div className='flex justify-between items-center w-[240px]'>
                        <Link href='/' passHref legacyBehavior>
                            <a className='text-white text-2xl' target='_blank' aria-label='Facebook'>
                                <i className='fa fa-facebook' />
                            </a>
                        </Link>
                        <Link href='/' passHref legacyBehavior>
                            <a className='text-white text-2xl' target='_blank' aria-label='Instagram'>
                                <i className='fa fa-instagram' />
                            </a>
                        </Link>
                        <Link href='/' passHref legacyBehavior>
                            <a className='text-white text-2xl' target='_blank' aria-label='Youtube'>
                                <i className='fa fa-youtube' />
                            </a>
                        </Link>
                        <Link href='/service' passHref legacyBehavior>
                            <a className='text-white text-2xl' target='_blank' aria-label='Twitter'>
                                <i className='fa fa-twitter' />
                            </a>
                        </Link>
                        <Link href='/service' passHref legacyBehavior>
                            <a className='text-white text-2xl' target='_blank' aria-label='LinkedIn'>
                                <i className='fa fa-linkedin' />
                            </a>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Footer;