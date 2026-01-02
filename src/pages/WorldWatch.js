import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/WorldWatch.css';

const WorldWatch = ({ onAdminClick, onAboutClick }) => {
  const { t, i18n } = useTranslation();
  const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
  const [tyrantTime, setTyrantTime] = useState('12:00');

  // Common timezones for Last Z players - with countries
  const timezones = [
    { id: 'server', label: '🗻 Server Time (GMT-2)', tz: 'Etc/GMT+2', country: 'Server' },
    { id: 'utc', label: 'UTC', tz: 'UTC', country: 'UTC' },
    
    // Americas
    { id: 'us-east', label: '🇺🇸 US East (EST)', tz: 'America/New_York', country: 'USA' },
    { id: 'us-central', label: '🇺🇸 US Central (CST)', tz: 'America/Chicago', country: 'USA' },
    { id: 'us-mountain', label: '🇺🇸 US Mountain (MST)', tz: 'America/Denver', country: 'USA' },
    { id: 'us-pacific', label: '🇺🇸 US Pacific (PST)', tz: 'America/Los_Angeles', country: 'USA' },
    { id: 'ca', label: '🇨🇦 Canada (EST)', tz: 'America/Toronto', country: 'Canada' },
    { id: 'mx', label: '🇲🇽 Mexico (CST)', tz: 'America/Mexico_City', country: 'Mexico' },
    { id: 'br', label: '🇧🇷 Brazil (BRT)', tz: 'America/Sao_Paulo', country: 'Brazil' },
    { id: 'ar', label: '🇦🇷 Argentina (ART)', tz: 'America/Argentina/Buenos_Aires', country: 'Argentina' },
    { id: 'cl', label: '🇨🇱 Chile (CLT)', tz: 'America/Santiago', country: 'Chile' },
    { id: 'pe', label: '🇵🇪 Peru (PET)', tz: 'America/Lima', country: 'Peru' },
    { id: 'co', label: '🇨🇴 Colombia (COT)', tz: 'America/Bogota', country: 'Colombia' },
    { id: 'ec', label: '🇪🇨 Ecuador (ECT)', tz: 'America/Guayaquil', country: 'Ecuador' },
    { id: 'do', label: '🇩🇴 Dominican Republic (AST)', tz: 'America/Santo_Domingo', country: 'Dominican Republic' },
    { id: 'cr', label: '🇨🇷 Costa Rica (CST)', tz: 'America/Costa_Rica', country: 'Costa Rica' },
    
    // Europe
    { id: 'uk', label: '🇬🇧 UK (GMT)', tz: 'Europe/London', country: 'UK' },
    { id: 'pt', label: '🇵🇹 Portugal (WET)', tz: 'Europe/Lisbon', country: 'Portugal' },
    { id: 'es', label: '🇪🇸 Spain (CET)', tz: 'Europe/Madrid', country: 'Spain' },
    { id: 'be', label: '🇧🇪 Belgium (CET)', tz: 'Europe/Brussels', country: 'Belgium' },
    { id: 'eu-west', label: '🇮🇪 EU West (GMT/IST)', tz: 'Europe/Dublin', country: 'Ireland' },
    { id: 'eu-central', label: '🇩🇪 Germany (CET)', tz: 'Europe/Berlin', country: 'Germany' },
    { id: 'it', label: '🇮🇹 Italy (CET)', tz: 'Europe/Rome', country: 'Italy' },
    { id: 'ch', label: '🇨🇭 Switzerland (CET)', tz: 'Europe/Zurich', country: 'Switzerland' },
    { id: 'cz', label: '🇨🇿 Czech Republic (CET)', tz: 'Europe/Prague', country: 'Czech Republic' },
    { id: 'hr', label: '🇭🇷 Croatia (CET)', tz: 'Europe/Zagreb', country: 'Croatia' },
    { id: 'ro', label: '🇷🇴 Romania (EET)', tz: 'Europe/Bucharest', country: 'Romania' },
    { id: 'tr', label: '🇹🇷 Turkey (EET)', tz: 'Europe/Istanbul', country: 'Turkey' },
    { id: 'tn', label: '🇹🇳 Tunisia (CET)', tz: 'Africa/Tunis', country: 'Tunisia' },
    { id: 'ru', label: '🇷🇺 Russia (MSK)', tz: 'Europe/Moscow', country: 'Russia' },
    
    // Asia
    { id: 'in', label: '🇮🇳 India (IST)', tz: 'Asia/Kolkata', country: 'India' },
    { id: 'bd', label: '🇧🇩 Bangladesh (BDT)', tz: 'Asia/Dhaka', country: 'Bangladesh' },
    { id: 'th', label: '🇹🇭 Thailand (ICT)', tz: 'Asia/Bangkok', country: 'Thailand' },
    { id: 'my', label: '🇲🇾 Malaysia (MYT)', tz: 'Asia/Kuala_Lumpur', country: 'Malaysia' },
    { id: 'id', label: '🇮🇩 Indonesia (WIB)', tz: 'Asia/Jakarta', country: 'Indonesia' },
    { id: 'kz', label: '🇰🇿 Kazakhstan (ALMT)', tz: 'Asia/Almaty', country: 'Kazakhstan' },
    { id: 'cn', label: '🇨🇳 China (CST)', tz: 'Asia/Shanghai', country: 'China' },
    { id: 'kr', label: '🇰🇷 Korea (KST)', tz: 'Asia/Seoul', country: 'South Korea' },
    { id: 'jp', label: '🇯🇵 Japan (JST)', tz: 'Asia/Tokyo', country: 'Japan' },
    { id: 'ph', label: '🇵🇭 Philippines (PHT)', tz: 'Asia/Manila', country: 'Philippines' },
    
    // Oceania
    { id: 'au', label: '🇦🇺 Australia (AEST)', tz: 'Australia/Sydney', country: 'Australia' },
    { id: 'nz', label: '🇳🇿 New Zealand (NZST)', tz: 'Pacific/Auckland', country: 'New Zealand' },
  ];

  const eventTimes = [
    { name: 'Canyon Clash', times: ['09:00', '18:00', '23:00'], day: 'Friday', dayNumber: 5 },
    { name: 'Capital Clash', times: ['12:00'], day: 'Saturday', dayNumber: 6 },
    { name: 'AvA Buster Day', times: ['00:00'], day: 'Saturday', dayNumber: 6 },
  ];

  const convertTime = (serverTime, fromTz, toTz, eventDay) => {
    try {
      const [hours, minutes] = serverTime.split(':').map(Number);
      
      // If converting from and to the same timezone (Server Time case), just return the server time
      if (fromTz === toTz) {
        return serverTime;
      }
      
      const now = new Date();
      
      // Get current date in source timezone
      const sourceNowParts = new Intl.DateTimeFormat('en-US', {
        timeZone: fromTz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'long',
      }).formatToParts(now);

      const sourceMap = {};
      sourceNowParts.forEach(part => {
        sourceMap[part.type] = part.value;
      });

      let year = parseInt(sourceMap.year);
      let month = parseInt(sourceMap.month) - 1;
      let day = parseInt(sourceMap.day);
      
      // First, adjust to the correct day of week if this is a special event
      if (eventDay !== null && eventDay !== undefined) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentSourceDay = dayNames.indexOf(sourceMap.weekday);
        
        if (currentSourceDay !== eventDay) {
          const daysToAdd = (eventDay - currentSourceDay + 7) % 7;
          if (daysToAdd > 0) {
            // Create a date on the correct day of week
            const tempDate = new Date(Date.UTC(year, month, day));
            tempDate.setUTCDate(tempDate.getUTCDate() + daysToAdd);
            year = tempDate.getUTCFullYear();
            month = tempDate.getUTCMonth();
            day = tempDate.getUTCDate();
          }
        }
      }
      
      // Calculate timezone offset using test point on the target date
      const sourceFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: fromTz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      // Test what time it shows at midnight UTC on target date
      const testUTC = new Date(Date.UTC(year, month, day, 0, 0, 0));
      const formatted = sourceFormatter.format(testUTC);
      const [testHours, testMinutes] = formatted.split(':').map(Number);
      
      // This gives us the offset: at UTC 00:00, source timezone shows testHours:testMinutes
      let offsetHours = testHours;
      let offsetMinutes = testMinutes;
      
      // Handle day wraparound
      if (testHours > 12) {
        // Previous day (timezone is behind)
        offsetHours -= 24;
      }
      
      // Now calculate: if offset is +5 and we want 09:00 local, UTC should be 09:00 - 05:00 = 04:00
      let utcHours = hours - offsetHours;
      let utcMinutes = minutes - offsetMinutes;
      
      // Normalize minutes
      if (utcMinutes < 0) {
        utcHours--;
        utcMinutes += 60;
      } else if (utcMinutes >= 60) {
        utcHours++;
        utcMinutes -= 60;
      }
      
      // Normalize hours (adjust day if needed)
      if (utcHours < 0) {
        day--;
        utcHours += 24;
      } else if (utcHours >= 24) {
        day++;
        utcHours -= 24;
      }
      
      // Create the UTC event date
      let eventDate = new Date(Date.UTC(year, month, day, utcHours, utcMinutes, 0));

      // Format the time in target timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: toTz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const timeStr = formatter.format(eventDate);

      // Check if date changed - compare full dates including month and year
      const targetDateParts = new Intl.DateTimeFormat('en-US', {
        timeZone: toTz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(eventDate);
      
      const sourceDateParts = new Intl.DateTimeFormat('en-US', {
        timeZone: fromTz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).formatToParts(eventDate);

      const targetMonth = parseInt(targetDateParts.find(p => p.type === 'month').value);
      const targetYear = parseInt(targetDateParts.find(p => p.type === 'year').value);
      const targetDay = parseInt(targetDateParts.find(p => p.type === 'day').value);
      
      const sourceMonth = parseInt(sourceDateParts.find(p => p.type === 'month').value);
      const sourceYear = parseInt(sourceDateParts.find(p => p.type === 'year').value);
      const sourceDay = parseInt(sourceDateParts.find(p => p.type === 'day').value);
      
      let dateIndicator = '';
      // Create comparable date numbers: YYYYMMDD
      const targetDateNum = targetYear * 10000 + targetMonth * 100 + targetDay;
      const sourceDateNum = sourceYear * 10000 + sourceMonth * 100 + sourceDay;
      
      if (targetDateNum > sourceDateNum) {
        dateIndicator = ' +1';
      } else if (targetDateNum < sourceDateNum) {
        dateIndicator = ' -1';
      }

      return timeStr + dateIndicator;
    } catch (error) {
      console.error('Time conversion error:', error);
      return 'N/A';
    }
  };

  const getCurrentServerTime = () => {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Etc/GMT+2',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      return formatter.format(now);
    } catch (error) {
      return 'N/A';
    }
  };

  const getCurrentLocalTime = (timezone) => {
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      return formatter.format(now);
    } catch (error) {
      return 'N/A';
    }
  };

  const getDayDisplay = (eventDay) => {
    if (eventDay === null) return t('worldWatch.days.Sunday');
    const dayKeys = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return t(`worldWatch.days.${dayKeys[eventDay]}`);
  };

  return (
    <div className="world-watch">
      <div className="watch-header">
        <h1>🌍 {t('worldWatch.title')}</h1>
        <p className="subtitle">{t('worldWatch.subtitle')}</p>
        <div className="current-time-section">
          <div className="current-server-time">
            <p className="server-time-label">⏱️ {t('worldWatch.serverTimeLabel')}</p>
            <p className="server-time-display">{getCurrentServerTime()}</p>
          </div>
          <div className="current-local-time">
            <p className="local-time-label">📍 {t('worldWatch.yourTimeLabel', { country: timezones.find(t => t.id === selectedTimezone)?.country })}</p>
            <p className="local-time-display">
              {getCurrentLocalTime(timezones.find(t => t.id === selectedTimezone)?.tz || 'UTC')}
            </p>
          </div>
        </div>
      </div>

      <div className="watch-container">
        <div className="events-grid">
          {/* Canyon Clash - Full Left Side */}
          <div className="event-card canyon-clash-card">
            <h3>{t('worldWatch.canyonClash')}</h3>
            <p className="event-day">{getDayDisplay(eventTimes[0].dayNumber)}</p>
            <div className="times-container">
              {eventTimes[0].times.map((time, timeIdx) => (
                <div key={timeIdx} className="time-display">
                  <div className="server-time">
                    <span className="label">Server</span>
                    <span className="time">{time}</span>
                    <span className="tz">GMT-2</span>
                  </div>
                  <div className="arrow">→</div>
                  <div className="local-time">
                    <span className="label">Your Time</span>
                    <span className="time">
                      {selectedTimezone === 'server' 
                        ? time 
                        : convertTime(time, 'Etc/GMT+2', timezones.find(t => t.id === selectedTimezone)?.tz || 'UTC', eventTimes[0].dayNumber)}
                    </span>
                    <span className="tz">
                      {selectedTimezone === 'server' ? 'GMT-2' : timezones.find(t => t.id === selectedTimezone)?.label.split(' ')[1]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capital Clash - Top Right */}
          <div className="event-card capital-clash-card">
            <h3>{t('worldWatch.capitalClash')}</h3>
            <p className="event-day">{getDayDisplay(eventTimes[1].dayNumber)}</p>
            <div className="times-container">
              {eventTimes[1].times.map((time, timeIdx) => (
                <div key={timeIdx} className="time-display">
                  <div className="server-time">
                    <span className="label">Server</span>
                    <span className="time">{time}</span>
                    <span className="tz">GMT-2</span>
                  </div>
                  <div className="arrow">→</div>
                  <div className="local-time">
                    <span className="label">Your Time</span>
                    <span className="time">
                      {selectedTimezone === 'server' 
                        ? time 
                        : convertTime(time, 'Etc/GMT+2', timezones.find(t => t.id === selectedTimezone)?.tz || 'UTC', eventTimes[1].dayNumber)}
                    </span>
                    <span className="tz">
                      {selectedTimezone === 'server' ? 'GMT-2' : timezones.find(t => t.id === selectedTimezone)?.label.split(' ')[1]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AvA Buster Day - Top Right */}
          <div className="event-card ava-buster-card">
            <h3>{t('worldWatch.avaBusterDay')}</h3>
            <p className="event-day">{getDayDisplay(eventTimes[2].dayNumber)}</p>
            <div className="times-container">
              {eventTimes[2].times.map((time, timeIdx) => (
                <div key={timeIdx} className="time-display">
                  <div className="server-time">
                    <span className="label">Server</span>
                    <span className="time">{time}</span>
                    <span className="tz">GMT-2</span>
                  </div>
                  <div className="arrow">→</div>
                  <div className="local-time">
                    <span className="label">Your Time</span>
                    <span className="time">
                      {selectedTimezone === 'server' 
                        ? time 
                        : convertTime(time, 'Etc/GMT+2', timezones.find(t => t.id === selectedTimezone)?.tz || 'UTC', eventTimes[2].dayNumber)}
                    </span>
                    <span className="tz">
                      {selectedTimezone === 'server' ? 'GMT-2' : timezones.find(t => t.id === selectedTimezone)?.label.split(' ')[1]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tyrant Time - Bottom Right */}
          <div className="tyrant-time-card">
            <h3>⚔️ {t('worldWatch.tyrantTime')}</h3>
            <p className="tyrant-subtitle">{t('worldWatch.tyrantSubtitle')}</p>
            <div className="tyrant-boxes-wrapper">
              <div className="tyrant-input-box">
                <span className="tyrant-label">{t('worldWatch.serverTime')}</span>
                <div className="tyrant-time-picker">
                  <div className="time-component">
                    <button 
                      className="time-btn-increment"
                      onClick={() => {
                        const [h, m] = tyrantTime.split(':');
                        const newH = String((parseInt(h) + 1) % 24).padStart(2, '0');
                        setTyrantTime(`${newH}:${m}`);
                      }}
                    >▲</button>
                    <div className="time-display-hour">{tyrantTime.split(':')[0]}</div>
                    <button 
                      className="time-btn-decrement"
                      onClick={() => {
                        const [h, m] = tyrantTime.split(':');
                        const newH = String((parseInt(h) - 1 + 24) % 24).padStart(2, '0');
                        setTyrantTime(`${newH}:${m}`);
                      }}
                    >▼</button>
                  </div>
                  <span className="time-separator">:</span>
                  <div className="time-component">
                    <button 
                      className="time-btn-increment"
                      onClick={() => {
                        const [h, m] = tyrantTime.split(':');
                        const newM = String((parseInt(m) + 5) % 60).padStart(2, '0');
                        setTyrantTime(`${h}:${newM}`);
                      }}
                    >▲</button>
                    <div className="time-display-minute">{tyrantTime.split(':')[1]}</div>
                    <button 
                      className="time-btn-decrement"
                      onClick={() => {
                        const [h, m] = tyrantTime.split(':');
                        const newM = String((parseInt(m) - 5 + 60) % 60).padStart(2, '0');
                        setTyrantTime(`${h}:${newM}`);
                      }}
                    >▼</button>
                  </div>
                </div>
              </div>
              <div className="tyrant-server-time">
                <span className="tyrant-label">{t('worldWatch.yourLocalTime')}</span>
                <span className="tyrant-value">
                  {tyrantTime ? convertTime(tyrantTime, 'Etc/GMT+2', timezones.find(t => t.id === selectedTimezone)?.tz || 'UTC', null) : '—'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="timezone-selector">
          <h2>{t('worldWatch.selectTimezone')}</h2>
          <div className="timezone-buttons">
            {timezones.map(tz => (
              <button
                key={tz.id}
                className={`tz-btn ${selectedTimezone === tz.id ? 'active' : ''}`}
                onClick={() => setSelectedTimezone(tz.id)}
              >
                {tz.label}
              </button>
            ))}
          </div>
        </div>

        <div className="timezone-table">
          <h2>{t('worldWatch.allEventTimesBy')}</h2>
          <table>
            <thead>
              <tr>
                <th>{t('worldWatch.timezone')}</th>
                {eventTimes.map((event, idx) => (
                  <th key={idx}>
                    {idx === 0 && t('worldWatch.canyonClash')}
                    {idx === 1 && t('worldWatch.capitalClash')}
                    {idx === 2 && t('worldWatch.avaBusterDay')}
                    <span className="event-day-header">{getDayDisplay(event.dayNumber)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timezones.map(tz => (
                <tr key={tz.id} className={selectedTimezone === tz.id ? 'highlighted' : ''}>
                  <td className="tz-name">{tz.label}</td>
                  {eventTimes.map((event, idx) => (
                    <td key={idx} className="event-time">
                      <div className="time-slot">
                        {event.times.map((time, timeIdx) => (
                          <div key={timeIdx} className="time-value">
                            {convertTime(time, 'Etc/GMT+2', tz.tz, event.dayNumber)}
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorldWatch;
