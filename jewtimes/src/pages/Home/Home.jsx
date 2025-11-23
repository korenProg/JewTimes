import Button from '../../components/common/Button';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to React + Vite</h1>
      <p>A modern, fast, and scalable architecture for your React applications.</p>
      <Button onClick={() => alert('Hello!')}>Get Started</Button>
    </div>
  );
};

export default Home;
