import React, { useEffect, useState } from "react";

const pokemonImages = {
  Egg: "https://i.imgur.com/H42miYd.png",
  Bulbasaur: "https://img.pokemondb.net/artwork/bulbasaur.jpg",
  Ivysaur: "https://img.pokemondb.net/artwork/ivysaur.jpg",
  Venusaur: "https://img.pokemondb.net/artwork/venusaur.jpg",
  Charmander: "https://img.pokemondb.net/artwork/charmander.jpg",
  Charmeleon: "https://img.pokemondb.net/artwork/charmeleon.jpg",
  Charizard: "https://img.pokemondb.net/artwork/charizard.jpg",
  Squirtle: "https://img.pokemondb.net/artwork/squirtle.jpg",
  Wartortle: "https://img.pokemondb.net/artwork/wartortle.jpg",
  Blastoise: "https://img.pokemondb.net/artwork/blastoise.jpg",
  Chikorita: "https://img.pokemondb.net/artwork/chikorita.jpg",
  Bayleef: "https://img.pokemondb.net/artwork/bayleef.jpg",
  Meganium: "https://img.pokemondb.net/artwork/meganium.jpg",
  Cyndaquil: "https://img.pokemondb.net/artwork/cyndaquil.jpg",
  Quilava: "https://img.pokemondb.net/artwork/quilava.jpg",
  Typhlosion: "https://img.pokemondb.net/artwork/typhlosion.jpg",
  Totodile: "https://img.pokemondb.net/artwork/totodile.jpg",
  Croconaw: "https://img.pokemondb.net/artwork/croconaw.jpg",
  Feraligatr: "https://img.pokemondb.net/artwork/feraligatr.jpg"
};

const PokemonCard = ({ user, pokemon, level, xp, nextLevelXP, isMaxed, onClick }) => {
  const percent = isMaxed ? 100 : Math.floor((xp / nextLevelXP) * 100);
  const imageUrl = pokemonImages[pokemon] || pokemonImages["Egg"];

  const badgeIcons = {
    Week1: 'https://image.pngaaa.com/482/1224482-middle.png',
    Week2: 'https://static.wikia.nocookie.net/pokemeow/images/7/70/Cascade_badge.png',
    Week3: '/badges/week3.svg',
    Week4: '/badges/week4.svg',
    Week5: '/badges/week5.svg',
  };

  const currWeek = 3;
  const weekSlots = [
    { week: "1", side: "left", position: "top" },
    { week: "2", side: "right", position: "top" },
    { week: "3", side: "left", position: "middle" },
    { week: "4", side: "right", position: "middle" },
    { week: "5", side: "left", position: "bottom" },
  ];

  const badgePositions = weekSlots.filter(
    (slot) => parseInt(slot.week) < currWeek && user.badges.includes(slot.week)
  );

  const renderBadge = (badge) => (
    <span key={`${badge.side}-${badge.week}`} className="w-6 h-6">
      <img
        src={badgeIcons[`Week${badge.week}`]}
        alt={`Week ${badge.week} badge`}
        className="w-full h-full object-contain"
      />
    </span>
  );

  const renderBadgeColumn = (side) =>
    ["top", "middle", "bottom"].map((pos) => {
      const badge = badgePositions.find(
        (b) => b.side === side && b.position === pos
      );
      return badge ? (
        renderBadge(badge)
      ) : (
        <span key={`${side}-placeholder-${pos}`} className="h-6 w-6" />
      );
    });

  return (
    <div
      className="border rounded-2xl shadow p-4 bg-white w-64 cursor-pointer hover:shadow-lg transition"
      onClick={onClick}
    >
      <div className="text-center">
          <h2 className="text-xl font-bold mb-2">{user.name || user}</h2>
          <div className="relative flex justify-center mb-2">
        <img
          src={imageUrl}
          alt={pokemon}
              className="w-32 h-32 object-contain mx-auto"
            />
            {badgePositions.length > 0 && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="flex justify-between h-full px-1 py-2">
                  <div className="flex flex-col justify-between h-full">
                    {renderBadgeColumn("left")}
                  </div>
                  <div className="flex flex-col justify-between h-full items-end">
                    {renderBadgeColumn("right")}
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="text-lg font-medium">Pokémon: {pokemon}</p>
          <p className="text-md text-gray-800">Level {level}</p>
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {xp} XP / {isMaxed ? "MAX" : `${nextLevelXP} XP`}
          </p>
        </div>
      </div>
    </div>
  );
};

const MAX_LEVEL = 60;

export default function Roster() {
  const [users, setUsers] = useState([]);
  const [xpTable, setXpTable] = useState([]);
  const [sortOption, setSortOption] = useState("level");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 25;

  const SHEET_ID = "1rQgIaNxlXy5AVEjfeeI0Xbk7lcl1iH0Ds9M3Woq_FSY";
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const TRACKER_SHEET = "Pokemon Fitness Tracker";
  const LEVELXP_SHEET = "LevelXP";
  const STARTER_SHEET = "Starters";

  useEffect(() => {
    const fetchXPTable = async () => {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${LEVELXP_SHEET}?key=${API_KEY}`
      );
      const data = await res.json();
      if (data?.values?.length > 1) {
        const table = data.values.slice(1).map(row => ({
          level: Number(row[0]),
          xp: Number(row[1])
        }));
        setXpTable(table);
      }
    };
    fetchXPTable();
  }, []);

  useEffect(() => {
    if (!xpTable.length) return;

    const fetchUsers = async () => {
      const [trackerRes, starterRes] = await Promise.all([
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${TRACKER_SHEET}?key=${API_KEY}`),
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${STARTER_SHEET}?key=${API_KEY}`)
      ]);
      const trackerData = await trackerRes.json();
      const starterData = await starterRes.json();

      const rows = trackerData?.values;
      const starters = starterData?.values;
      if (!rows || rows.length <= 9 || !starters || starters.length < 2) return;

      const header = rows[8];
      const nameIdx = header.indexOf("Trainer");
      const xpIdx = header.indexOf("Total XP");
      const weekXPIdx = header.indexOf("Weekly XP");
      const pokemonIdx = header.indexOf("Pokemon");
      const weekIdx = header.indexOf("Week");
  
      
      const weeklyRows = {};
      for (let i = 9; i < rows.length; i++) {
        const row = rows[i];
        const week = row[weekIdx];
        if (!weeklyRows[week]) weeklyRows[week] = [];
        weeklyRows[week].push(row);
      }
  
     
      const weeklyTop10 = {};
      for (const [week, entries] of Object.entries(weeklyRows)) {
        const sorted = [...entries].sort((a, b) => {
          return Number(b[weekXPIdx] || 0) - Number(a[weekXPIdx] || 0);
        });
        weeklyTop10[week] = sorted.slice(0, 10).map(row => row[nameIdx]);
      }

      const statIndices = {
        steps: header.indexOf("Steps"),
        minutes: header.indexOf("Minutes"),
        yoga: header.indexOf("Yoga Days"),
        bingo: header.indexOf("Bingo"),
        challenges: header.indexOf("MWF Challenges"),
        stepsXP: header.indexOf("Step XP"),
        minutesXP: header.indexOf("Minute XP"),
        yogaXP: header.indexOf("Yoga XP"),
        bingoXP: header.indexOf("Bingo XP"),
        challengesXP: header.indexOf("MWF XP"),
        totalSteps: header.indexOf("total steps"),
        totalMin: header.indexOf("total min"),
        totalYoga: header.indexOf("total yoga"),
        totalBingo: header.indexOf("total bingo"),
        totalMWF: header.indexOf("total mwf"),
        totalStepsXP: header.indexOf("total steps xp"),
        totalMinXP: header.indexOf("total min xp"),
        totalYogaXP: header.indexOf("total yoga xp"),
        totalBingoXP: header.indexOf("total bingo xp"),
        totalMWFXP: header.indexOf("total mwf xp")
      };

      const seen = new Set();
      const latest = [];

      for (let i = rows.length - 1; i > 8; i--) {
        const row = rows[i];
        const name = row[nameIdx];
        const thisWeek = row[weekIdx];
        if (!name || seen.has(name)) continue;

        const totalXP = Number(row[xpIdx] || 0);
        const weekXP = Number(row[weekXPIdx] || 0);

        let level = 1;
        for (let j = xpTable.length - 1; j >= 0; j--) {
          if (totalXP >= xpTable[j].xp) {
            level = xpTable[j].level;
            break;
          }
        }

        const isMaxed = level >= MAX_LEVEL;
        const nextLevelXP = isMaxed
          ? xpTable.find(e => e.level === MAX_LEVEL)?.xp || 0
          : xpTable.find(l => l.level === level + 1)?.xp || totalXP;

        const pokemon = row[pokemonIdx] || "Egg";

       
        const badges = Object.entries(weeklyTop10)
          .filter(([week, topUsers]) => topUsers.includes(name))
          .map(([week]) => week);
  
        latest.push({
          name,
          pokemon,
          totalXP,
          weekXP,
          level,
          numericLevel: level,
          nextLevelXP,
          isMaxed,
          badges,
          stats: {
            steps: row[statIndices.steps] || 0,
            minutes: row[statIndices.minutes] || 0,
            yoga: row[statIndices.yoga] || 0,
            bingo: row[statIndices.bingo] || 0,
            challenges: row[statIndices.challenges] || 0,
            stepsXP: row[statIndices.stepsXP] || 0,
            minutesXP: row[statIndices.minutesXP] || 0,
            yogaXP: row[statIndices.yogaXP] || 0,
            bingoXP: row[statIndices.bingoXP] || 0,
            challengesXP: row[statIndices.challengesXP] || 0,
            totalSteps: row[statIndices.totalSteps] || 0,
            totalMin: row[statIndices.totalMin] || 0,
            totalYoga: row[statIndices.totalYoga] || 0,
            totalBingo: row[statIndices.totalBingo] || 0,
            totalMWF: row[statIndices.totalMWF] || 0,
            totalStepsXP: row[statIndices.totalStepsXP] || 0,
            totalMinXP: row[statIndices.totalMinXP] || 0,
            totalYogaXP: row[statIndices.totalYogaXP] || 0,
            totalBingoXP: row[statIndices.totalBingoXP] || 0,
            totalMWFXP: row[statIndices.totalMWFXP] || 0
          }
        });

        seen.add(name);
      }
      setUsers(latest);
    };

    fetchUsers();
  }, [xpTable]);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOption === "level") return b.numericLevel - a.numericLevel;
    if (sortOption === "username") return a.name.localeCompare(b.name);
    if (sortOption === "weekXP") return b.weekXP - a.weekXP;
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 items-center justify-center mb-6">
        <label htmlFor="sort" className="text-lg font-semibold">Sort by:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={e => setSortOption(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="username">Username</option>
          <option value="level">Level</option>
          <option value="weekXP">Weekly XP</option>
        </select>
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-full sm:w-64"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {paginatedUsers.map(user => (
          <PokemonCard
            key={user.name}
          user={user} 
            pokemon={user.pokemon}
            level={user.level > MAX_LEVEL ? "MEGA" : user.level}
            xp={user.totalXP}
            nextLevelXP={user.nextLevelXP}
            isMaxed={user.isMaxed}
            onClick={() => setSelectedUser(user)}
          />
        ))}
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded border ${
              currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl sm:text-2xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-2">{selectedUser.name}</h2>
            <img
              src={pokemonImages[selectedUser.pokemon]}
              alt={selectedUser.pokemon}
              className="w-40 h-40 object-contain mx-auto mb-4"
            />
            <p className="text-lg">Pokémon: {selectedUser.pokemon}</p>
            <p className="text-md">Level: {selectedUser.level}</p>
            <p className="text-md">Total XP: {selectedUser.totalXP}</p>
            <p className="text-md">Weekly XP: {selectedUser.weekXP}</p>

            <div className="mt-4 space-y-2">
              <p className="font-semibold text-lg">Last week's stats:</p>
              <p>+ {selectedUser.stats.stepsXP} XP ({selectedUser.stats.steps} steps)</p>
              <p>+ {selectedUser.stats.minutesXP} XP ({selectedUser.stats.minutes} minutes)</p>
              <p>+ {selectedUser.stats.yogaXP} XP ({selectedUser.stats.yoga} yoga sessions)</p>
              <p>+ {selectedUser.stats.bingoXP} XP ({selectedUser.stats.bingo} bingo)</p>
              <p>+ {selectedUser.stats.challengesXP} XP ({selectedUser.stats.challenges} challenges)</p>
              <p className="font-semibold">Total: {selectedUser.weekXP} XP</p>

              <p className="font-semibold text-lg mt-4">Total stats:</p>
              <p>{selectedUser.stats.totalSteps} steps ({selectedUser.stats.totalStepsXP} XP)</p>
              <p>{selectedUser.stats.totalMin} minutes ({selectedUser.stats.totalMinXP} XP)</p>
              <p>{selectedUser.stats.totalYoga} yoga ({selectedUser.stats.totalYogaXP} XP)</p>
              <p>{selectedUser.stats.totalBingo} bingo ({selectedUser.stats.totalBingoXP} XP)</p>
              <p>{selectedUser.stats.totalMWF} challenges ({selectedUser.stats.totalMWFXP} XP)</p>
              <p className="font-semibold">Total: {selectedUser.totalXP} XP</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
