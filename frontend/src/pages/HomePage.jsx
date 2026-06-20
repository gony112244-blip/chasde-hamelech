import PageMeta from '../components/PageMeta';
import Reveal from '../components/Reveal';
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
            <PageMeta 
                path="/" 
                title="מתנות לילדים חולים, חלוקה בבתי חולים והתנדבות" 
                description="עמותת חסדי המלך משמחת ילדים מאושפזים ומחלקת מתנות לילדים, צעצועים וספרים בבתי חולים ברחבי הארץ. הצטרפו אלינו והחזירו את החיוך לגיבורים הקטנים." 
            />
            <HeroSection />
            <Reveal><SmileCounter /></Reveal>
            <Reveal><GalleryPreview /></Reveal>
            <Reveal><Testimonials /></Reveal>
            <Reveal><AboutSection /></Reveal>
            <Reveal><AuthorCorner /></Reveal>
            <Reveal><HowToHelp /></Reveal>
        </>
    );
}
