interface WelcomeProps {
  name: string;
}

const Welcome: React.FC<WelcomeProps> = ({ name }) => {
  return <h1>¡Hola, {name}!</h1>;
};

export default Welcome;
