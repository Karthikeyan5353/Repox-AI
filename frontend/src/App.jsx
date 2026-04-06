import HeroSection from './components/HeroSection';
import ReviewForm from './components/ReviewForm';
import './styles/app.css';

function App() {
  return (
    <main className="app-shell">
      <section className="app-card">
        <HeroSection />
        <ReviewForm />
      </section>
    </main>
  );
}

export default App;
