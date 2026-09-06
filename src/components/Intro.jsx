import intro from '../../content/intro.json';

export default function Intro() {
  return (
    <div className="intro">
      <p>{intro.quote}</p>
      <span>{intro.attribution}</span>
    </div>
  );
}
