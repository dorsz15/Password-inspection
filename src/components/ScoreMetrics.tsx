import './ScoreMetrics.css';

interface ScoreMetricsProps {
  strengthResult: any;
}

export default function ScoreMetrics({ strengthResult }: ScoreMetricsProps) {
  // Funkcja obliczająca wartości poszczególnych pasków (skala 0.0 do 10.0)
  const calculateMetrics = () => {
  if (!strengthResult || !strengthResult.sequence) {
    return { hardToCrack: 0, complexity: 0, dictionary: 0, spatial: 0, ngram: 0, overall: 0 };
  }

  const hardToCrack = (strengthResult.score / 4)*10;

  const currentLog = strengthResult.guessesLog10 !== undefined 
    ? strengthResult.guessesLog10 
    : (strengthResult.guesses_log10 || 0);
  const complexity = Math.min((currentLog / 12)*10, 10);

  const passwordLength = strengthResult.password ? strengthResult.password.length : 0;
  // Bazowy progres od 0 do 1 uzależniony od długości (np. pełna odporność przy 14 znakach)
  const lengthBonus = Math.min((passwordLength / 14)*10, 10);

  const segments = strengthResult.sequence;
  const hasDictionary = segments.some((s: any) => s.pattern === 'dictionary');
  const hasSpatialOrSequence = segments.some((s: any) => s.pattern === 'spatial' || s.pattern === 'sequence');
  const hasRepeat = segments.some((s: any) => s.pattern === 'repeat');

  // 3. Dictionary Resistance: rośnie z długością, ale jeśli wykryje słowo ze słownika -> spada do 0.1
  const dictionary = hasDictionary ? 1 : lengthBonus;

  // 4. Spacial Patterns: rośnie z długością, ale jeśli wykryje sekwencję klawiszy -> spada do 0.1
  const spatial = hasSpatialOrSequence ? 1 : lengthBonus;

  // 5. N-Gram Frequency: rośnie z długością, ale jeśli wykryje powtórzenia znaków -> spada silnie w dół
  const ngram = hasRepeat ? 1 : Math.min(lengthBonus * 1.1, 10); // nieco szybszy wzrost

  // Uśredniony wynik ogólny
  const overall = (hardToCrack + complexity + dictionary + spatial + ngram) / 5;



  return { hardToCrack, complexity, dictionary, spatial, ngram, overall };
};

  const metrics = calculateMetrics();
  
    const getColorClass = (value: number) => {
    if (value < 2) return 'fill-red';     // Bardzo słabe
    if (value < 4) return 'fill-pink';    // Słabe
    if (value < 6) return 'fill-indigo';  // Średnie
    if (value < 8) return 'fill-blue';    // Dobre
    return 'fill-cyan';                  // Bardzo dobre
  };
  
  const metricsList = [
    { label: 'HARD TO CRACK', value: metrics.hardToCrack },
    { label: 'COMPLEXITY', value: metrics.complexity},
    { label: 'DICTIONARY RESISTANCE', value: metrics.dictionary},
    { label: 'SPACIAL PATTERNS', value: metrics.spatial},
    { label: 'N-GRAM FREQUENCY', value: metrics.ngram}
  ];

  return (
    <section className="metrics-wrapper">
      <h3 className="metrics-title">SCORE METRICS</h3>
      
      <div className="metrics-main-box">
        <div className="metrics-table">
          {metricsList.map((item, index) => (
            <div className="metrics-row" key={index}>
              <div className="metric-info-side">
                <span className="metric-label">{item.label}</span>
                <span className="metric-number">{item.value.toFixed(1)}</span>
              </div>
              
              <div className="metric-bar-side">
                <div className="metric-progress-bg">
                  <div 
                    className={`metric-progress-fill ${getColorClass(item.value)}`} 
                    style={{ width: `${item.value * 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overall-score-container">
        <div className="overall-score-badge">
          <span className="overall-label">OVERALL SCORE</span>
          <span className="overall-number">{metrics.overall.toFixed(1)}</span>
        </div>
      </div>
    </section>
  );
}