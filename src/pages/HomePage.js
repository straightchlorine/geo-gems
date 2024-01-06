import React from 'react';
import '../HomePage.css';

function HomePage() {
  return (
    <div className="homepage container-fluid d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
        <h1 className="text-center mb-4">Witaj na GeoGems!</h1>
        <p className="text-center mb-5">
          GeoGems to miejsce, gdzie możesz odkrywać i zapisywać swoje ulubione miejsca na mapie. Skorzystaj z prostych kroków poniżej, aby rozpocząć podróż!
        </p>

        <div className="col-md-6">
          <h2 className="text-center mb-4">Jak korzystać z GeoGems?</h2>
          <ol>
            <li>Przybliż mapę, aby zobaczyć interesujące miejsca.</li>
            <li>Kliknij lewym przyciskiem myszy na mapie, aby wybrać miejsce.</li>
            <li>Użyj przycisku 'Dodaj do ulubionych', aby zapisywać wybrane miejsce.</li>
            <li>Twoje ulubione miejsca zostaną wyświetlone w panelu 'Ulubione lokalizacje' po prawej stronie ekranu.</li>
          </ol>

          <h3 className='text-center mb-5 mt-5'>Warto wiedzieć, że GeoGems wspiera geolokalizację!</h3>

          Po wejściu do 'Mapy' zostaniesz zapytany o zgodę do pobrania Twojej lokalizacji. Jeśli się zgodzisz,
          mapa automatycznie wyświetli Twoją lokalizację. <strong>Może to potrwać kilka chwil, więc prosimy o cierpliwość!</strong>
        </div>

      <p className="text-center mt-4 mb-4">
        <h5>Zanurz się w świecie GeoGems i odkrywaj fascynujące miejsca na całym świecie!</h5>
      </p>
    </div>
  );
}

export default HomePage;
