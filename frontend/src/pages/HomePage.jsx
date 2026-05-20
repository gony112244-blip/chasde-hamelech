import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import SmileCounter from '../components/home/SmileCounter';
import AboutSection from '../components/home/AboutSection';
import AuthorCorner from '../components/home/AuthorCorner';
import HowToHelp from '../components/home/HowToHelp';
import Testimonials from '../components/home/Testimonials';

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <SmileCounter />
            <AboutSection />
            <AuthorCorner />
            <HowToHelp />
            <Testimonials />
        </>
    );
}
