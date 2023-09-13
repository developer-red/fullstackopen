import { useState } from 'react';

// SurveyButton component to display individual survey buttons.
const SurveyButton = ({ title, onClick }) => (
    <button onClick={onClick}>{title}</button>
);

// SurveyPanel component to display the survey section.
const SurveyPanel = ({ goodClickHandler, neutralClickHandler, badClickHandler }) => (
    <div>
        <h1>Unicafe Survey</h1>
        <h2>What was your experience at Unicafe?</h2>
        <SurveyButton onClick={goodClickHandler} title="Good" />
        <SurveyButton onClick={neutralClickHandler} title="Neutral" />
        <SurveyButton onClick={badClickHandler} title="Bad" />
    </div>
);

// Statistic component to display individual statistics as table rows.
const Statistic = ({ name, value }) => (
    <tr>
        <td>{name}</td>
        <td>{value}</td>
    </tr>
);

// StatisticsPanel component to display the statistics section.
const StatisticsPanel = ({ statistics }) => {
    // Calculate total count of feedback.
    const total = statistics.reduce((acc, [name, value]) => {
        return !isNaN(value) ? acc + value : acc;
    }, 0);

    if (total === 0) {
        return <h3>No statistics yet</h3>;
    }

    return (
        <>
            <h2>Statistics</h2>
            <table>
                <tbody>
                {statistics.map(([name, value], i) => (
                    <Statistic key={i} name={name} value={value} />
                ))}
                </tbody>
            </table>
        </>
    );
};

// Main App component.
const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    // Click handlers for updating feedback states.
    const goodClickHandler = () => setGood(good + 1);
    const neutralClickHandler = () => setNeutral(neutral + 1);
    const badClickHandler = () => setBad(bad + 1);

    const total = good + neutral + bad;
    // Calculate average and positive percentage, guard against division by zero.
    const average = total ? ((good - bad) / total).toFixed(3) : 0;
    const positivePercentage = total ? ((good / total) * 100).toFixed(3) : 0;

    return (
        <div>
            <SurveyPanel
                goodClickHandler={goodClickHandler}
                neutralClickHandler={neutralClickHandler}
                badClickHandler={badClickHandler}
            />
            <StatisticsPanel
                statistics={[
                    ['Good', good],
                    ['Neutral', neutral],
                    ['Bad', bad],
                    ['Average', average],
                    ['Positive', `${positivePercentage}%`],
                ]}
            />
        </div>
    );
};

export default App;
