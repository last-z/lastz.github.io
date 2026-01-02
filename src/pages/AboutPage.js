import React from 'react';
import { useTranslation } from 'react-i18next';
import './AboutPage.css';

const AboutPage = ({ onNavigateToPlanner }) => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <div className="about-header">
        <button className="back-btn" onClick={onNavigateToPlanner}>
          ← {t('back') || 'Back'}
        </button>
        <div className="header-content">
          <h1>⚔️ ROLs' Canyon Clash Strategy</h1>
          <p className="header-subtitle">Made with ❤️ by ROLs #392</p>
        </div>
      </div>

      <div className="about-content">
        {/* Overview */}
        <section className="about-section">
          <h2>Event Overview</h2>
          <p>
            Canyon Clash is a weekly alliance event that takes place after Capital Clash. In this event, 
            two alliances face off in a points-based battle. You can earn points by capturing buildings, 
            destroying enemy vehicles, completing objectives like stealing energy cells, defeating zombie 
            bosses for buffs, and more.
          </p>
        </section>

        {/* Event Schedule */}
        <section className="about-section">
          <h2>Event Schedule</h2>
          <ul className="schedule-list">
            <li><strong>Monday & Tuesday:</strong> Voting phase – Alliance members vote for a time that works best for them</li>
            <li><strong>Wednesday:</strong> Registration phase – Alliances sign up to participate</li>
            <li><strong>Thursday:</strong> Matchmaking – Alliances are paired up for battle</li>
            <li><strong>Friday:</strong> Combat day – The big battle begins!</li>
          </ul>
        </section>

        {/* Eligibility */}
        <section className="about-section">
          <h2>Eligibility Requirements</h2>
          <ul className="eligibility-list">
            <li>Alliance must be ranked in the top 20 by power on your server</li>
            <li>Alliance must have at least 40 members</li>
            <li>Players must be in their alliance for at least 24 hours before joining</li>
            <li>Only Alliance Leader or R4 members can register</li>
            <li>Alliance needs at least 15 members signed up to participate</li>
          </ul>
        </section>

        {/* Battle Structure */}
        <section className="about-section">
          <h2>Battle Structure</h2>
          <p>The battle lasts 1 hour total, divided into phases:</p>
          <ul className="battle-list">
            <li><strong>Prep Phase (10 minutes):</strong> Starters enter the battlefield and prepare</li>
            <li><strong>Combat Phase (40 minutes):</strong> The action continues through several stages</li>
          </ul>
          <p className="mt-2">
            Your opponents are determined by the combined power of your 30 selected members. Set your 
            20 strongest players as Starters and the rest as Substitutes.
          </p>
        </section>

        {/* Commander System */}
        <section className="about-section">
          <h2>Commander System</h2>
          <p>The Commander is assigned during registration and has special powers:</p>
          <ul className="commander-list">
            <li>Group players on the battlefield</li>
            <li>Give orders and guide players during the battle</li>
            <li>Only R4 or the Alliance Leader can change the Commander once battle starts</li>
          </ul>
        </section>

        {/* Battle Phases */}
        <section className="about-section">
          <h2>Battle Phases</h2>
          <div className="phases-grid">
            <div className="phase-card">
              <h3>Phase 1</h3>
              <p>Capture the Field Hospital and Water Refinery for buffs, alliance points, and personal points. Capturing the Quarry also earns personal points.</p>
            </div>
            <div className="phase-card">
              <h3>Phase 2</h3>
              <p>The Canyon Captain (Boss) spawns at the 5th, 15th, and 25th minute. The alliance that deals the most damage gets powerful battlefield buffs.</p>
            </div>
            <div className="phase-card">
              <h3>Phase 3</h3>
              <p>The Military Base opens for capture. This gives alliance and personal points and boosts damage dealt while reducing damage taken.</p>
            </div>
            <div className="phase-card">
              <h3>Phase 4</h3>
              <p>The Energy Station opens at the 20th minute. Steal energy cells and return them to your alliance's beacon for big points.</p>
            </div>
          </div>
        </section>

        {/* Strategy Tips */}
        <section className="about-section">
          <h2>Strategy Tips</h2>
          <ul className="strategy-list">
            <li>Starters should defend against enemy captures, while Substitutes focus on capturing buildings</li>
            <li>Protect the energy cell carrier to secure more points</li>
            <li>Teleporting during battle is free, but there's a 3-minute cooldown between each teleport</li>
          </ul>
        </section>

        {/* Objectives and Buffs */}
        <section className="about-section">
          <h2>Key Objectives & Buffs</h2>
          <div className="objectives-grid">
            <div className="objective-card">
              <h3>🏥 Field Hospital</h3>
              <ul>
                <li>Alliance First Capture: +1,800 pts</li>
                <li>Personal First Capture: +900 pts</li>
                <li>Healing Speed: +50%</li>
                <li>Healing Cost: -5%</li>
              </ul>
            </div>
            <div className="objective-card">
              <h3>💧 Water Refinery</h3>
              <ul>
                <li>Alliance First Capture: +900 pts</li>
                <li>Personal First Capture: +450 pts</li>
                <li>Per Minute Control: +600 (A) / +300 (P)</li>
              </ul>
            </div>
            <div className="objective-card">
              <h3>🏭 Military Base</h3>
              <ul>
                <li>Alliance First Capture: +2,700 pts</li>
                <li>Personal First Capture: +1,350 pts</li>
                <li>Damage Dealt: +30%</li>
                <li>Damage Taken: -5%</li>
              </ul>
            </div>
            <div className="objective-card">
              <h3>⚡ Energy Station</h3>
              <ul>
                <li>Alliance Points: 100,000</li>
                <li>Personal Points: 10,000</li>
                <li>Return cells to beacon</li>
              </ul>
            </div>
            <div className="objective-card">
              <h3>👹 Canyon Captain</h3>
              <ul>
                <li>March Speed: +50%</li>
                <li>Points Yield: +50%</li>
                <li>Battle Damage: +40%</li>
              </ul>
            </div>
            <div className="objective-card">
              <h3>⛏️ Quarry</h3>
              <ul>
                <li>Alliance Per Min: +120 pts</li>
                <li>Personal Per Min: +60 pts</li>
                <li>Capture Bonus: +10 pts</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Rewards */}
        <section className="about-section">
          <h2>Event Rewards</h2>
          <div className="rewards-container">
            <div className="reward-group">
              <h3>🏆 Winner Alliance</h3>
              <div className="reward-content">
                <h4>Alliance Rewards:</h4>
                <ul>
                  <li>Orange Decoration Chest x1</li>
                  <li>Orange Skill Book x300</li>
                  <li>100 Diamonds x3</li>
                  <li>1 hour Construction Speed Up x10</li>
                  <li>Blue Wood Level Chest x5</li>
                  <li>Blue Food Level Chest x5</li>
                </ul>
                <h4>Personal Rewards:</h4>
                <ul>
                  <li>Purple Random Component Box x1</li>
                  <li>Orange Skill Book x300</li>
                  <li>100 Diamonds x3</li>
                  <li>1 hour Construction Speed Up x6</li>
                  <li>Blue Wood Level Chest x5</li>
                  <li>Blue Food Level Chest x5</li>
                </ul>
              </div>
            </div>
            <div className="reward-group">
              <h3>2️⃣ Loser Alliance</h3>
              <div className="reward-content">
                <h4>Alliance Rewards:</h4>
                <ul>
                  <li>Purple Decoration Chest x1</li>
                  <li>Orange Skill Book x150</li>
                  <li>100 Diamonds x2</li>
                  <li>1 hour Construction Speed Up x5</li>
                  <li>Blue Wood Level Chest x5</li>
                  <li>Blue Food Level Chest x5</li>
                </ul>
                <h4>Personal Rewards:</h4>
                <ul>
                  <li>Blue Random Component Box x1</li>
                  <li>Orange Skill Book x150</li>
                  <li>100 Diamonds x2</li>
                  <li>1 hour Construction Speed Up x5</li>
                  <li>Blue Wood Level Chest x5</li>
                  <li>Blue Food Level Chest x5</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section">
          <p className="wiki-link">
            📖 For more detailed information, visit the 
            <a href="https://last-z.wiki/events/canyon-clash-event/" target="_blank" rel="noopener noreferrer">
              Last Z Wiki - Canyon Clash Event
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
