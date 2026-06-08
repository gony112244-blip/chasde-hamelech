import PageMeta from '../components/PageMeta';
import HeroSection from '../components/home/HeroSection';
import SmileCounter from '../components/home/SmileCounter';
import GalleryPreview from '../components/home/GalleryPreview';
import AboutSection from '../components/home/AboutSection';
import AuthorCorner from '../components/home/AuthorCorner';
import HowToHelp from '../components/home/HowToHelp';
import Testimonials from '../components/home/Testimonials';

export default function HomePage() {
    return (
        <>
            <PageMeta title="חסדי המלך" description="מחלקים משחקים, ספרים ואהבה לילדים מאושפזים בבתי חולים בכל רחבי הארץ. הצטרפו אלינו!" path="/" />
            <HeroSection />
            <SmileCounter />
            <GalleryPreview />
            <Testimonials />
            <AboutSection />
            <AuthorCorner />
            <HowToHelp />
        </>
    );
}
