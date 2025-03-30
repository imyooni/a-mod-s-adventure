export function vocab(language) {
    return {
        eng: {
            newGameVocab: "New Game",
            optionsVocab: "Options",
            exitVocab: "Exit",
            goal: "Goal",
            day: "Day",
            endDay: "End Day",
            yes: "Yes",
            no: "No",
            shop: "Shop",
            free: "Free",
            finish: "Finish?"
        },
        kor: {
            newGameVocab: "새 게임",
            optionsVocab: "옵션",
            exitVocab: "종료",
            goal: "목표",
            day: "일", 
            endDay: "일 종료", 
            yes: "예",
            no: "아니요",
            shop: "상점",
            free: "공짜",
            finish: "다 했어요?",
        }
    }[language]; 
}


export function cards(mode,id = null) {
  const list = {
    error: { name: ["Error", "오류", "Error"], type: "error", cardColor: "rgba(36, 36, 36, 0.41)", round: 0, probability: 0 },
    healingI: { name: ["HP", "헬스", "PV"], type: "heal", cardColor: "rgb(219, 20, 60)", value: ["per", [2, 5]], round: 1, probability: 0.35 },
    elixir: { name: ["HP", "헬스", "PV"], type: "heal", cardColor: "rgb(20, 219, 126)", value: ["per", [100, 100]], round: 1, probability: 0.02 },
    maxhp: { name: ["Max HP", "최대 헬스", "PV Máx"], type: "mhp", cardColor: "rgb(219, 20, 129)", value: ["per", [2, 5]], round: 0, probability: 0.1 },
    damageI: { name: ["HP", "헬스", "PV"], type: "damage", cardColor: "rgb(219, 20, 60)", value: ["per", [-2, -5]], round: 0, probability: 0.25 },
    coins: { name: ["Coins", "코인", "Monedas"], type: "coins", cardColor: "rgb(252, 219, 50)", value: ["fixed", [5, 15]], round: 0, probability: 0.1 },
    points: { name: ["Points", "포인트", "Puntos"], type: "points", cardColor: "rgb(255,250,205)", value: ["fixed", [5, 20]], round: 0, probability: 0.3 },
    shield: { name: ["Shield", "방패", "Escudo"], type: "shield", cardColor: "rgb(176,196,222)", value: ["fixed", [1, 5]], round: 0, probability: 0.3 },
    books: { name: ["Books", "책", "Libros"], type: "books", cardColor: "rgb(123,104,238)", value: ["fixed", [1, 3]], round: 0, probability: 0.15 },
    key: { name: ["Key", "열쇠", "Llave"], type: "special", cardColor: "rgb(152,251,152)", round: 1, probability: 0 },
    shop: { name: ["Shop", "상점", "Tienda"], type: "shop", cardColor: "rgb(32, 139, 189)", round: 1, probability: 0 },
    chest: { name: ["Chest", "상자", "Cofre"], type: "chest", cardColor: "rgb(255,105,180)", round: 1, probability: 0 },
    battle: { name: ["Battle", "전투", "Batalla"], type: "battle", cardColor: "rgba(80, 80, 80)", round: 0, probability: 0.5 }
  };
  if (mode === "list") {
    return list;
  } else if (mode === "item") {
    return list[id]
  }
}

  function randomBattle(item,lang) {
   let battleTypes = {
     colors: {
      name: ["Colors","색깔","Colores"],
      borderColor: 'rgb(255,140,0)',
     },
     music: {
      name: ["Music","음악","Música"],
      borderColor: 'rgb(0, 255, 191)',
     },
     animals: {
      name: ["Animals","동물","Animales"],
      borderColor: 'rgb(157, 255, 0)',
     },
     geography: {
      name: ["Geography","지리학","Geografía"],
      borderColor: 'rgb(255, 0, 200)',
     },
     nouns: {
      name: ["Nouns","명사","Sustantivos"],
      borderColor: 'rgb(251, 255, 0)',
     },
     verbs: {
      name: ["Verbs","동사","Verbos"],
      borderColor: 'rgb(0, 174, 255)',
     },
     adjetives: {
      name: ["Adjectives","형용사","Adjetivos"],
      borderColor: 'rgb(162, 0, 255)',
     },
     general: {
      name: ["General","일반","General"],
      borderColor: 'rgb(255, 0, 0)',
     },
   }
 

   let availableTypes = Object.keys(battleTypes).filter(key => !usedCategories.includes(key));
   let randomKey = availableTypes[Math.floor(Math.random() * availableTypes.length)];
   let id = battleTypes[randomKey];
   item.name = id.name[languages().indexOf(lang)]
   item.category = randomKey
   item.borderColor = id.borderColor
   usedCategories.push(randomKey)
 }

function languages(){
  return ["en","kor","es"]
} 

let usedCategories = []
export function randomEvents(round,hp,lang) {
  let randomEvents = []
  usedCategories = []
  randomEvents.push(cards("item","battle"))
  randomEvents.push(cards("item","battle"))

  randomBattle(randomEvents[0],lang)
  randomBattle(randomEvents[1],lang)
  
  let events = Object.keys(cards("list"));
  for (let i = 0; i < events.length; i++) {
    const item = cards("item",events[i])
    if (item.probability === 0) continue
    if (item.round > round) continue
    if (item.type === "heal" && hp[0] === hp[1]) continue 
      if (Math.random() < item.probability) {
        if (item.value !== undefined) {
          let name = item.name[languages().indexOf(lang)]
          let value = Math.floor(Math.random() * (item.value[1][1] - item.value[1][0] + 1)) + item.value[1][0]
          item.value[1] = value
          if (item.value[1] >= 1) {
             if (item.value[0] === "fixed") {
               item.name = `${name}&nbsp;<span style="color: GreenYellow;">+${item.value[1]}</span>&nbsp;`
             } else if (item.value[0] === "per") {
               item.name = `${name}&nbsp;<span style="color: Gold;">+${item.value[1]}%</span>&nbsp;`
             }
          } else {
            if (item.value[0] === "fixed") {
              item.name = `${name}&nbsp;<span style="color: red;">${item.value[1]}</span>&nbsp;`
            } else if (item.value[0] === "per") {
              item.name = `${name}&nbsp;<span style="color: red;">${item.value[1]}%</span>&nbsp;`
            }
          }
      
        }
        if (item.type === "battle") {
          randomBattle(item,lang)
        }
        
        randomEvents.push(item)
        if (randomEvents.length === 6) break
      }
  }
  return randomEvents
}

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

export function randomWord(prevWord,lang,category) {
 
  /*
 const random_words = {
   en: {
     colors: [
      ["ro","jo"],["a","zul"],["ver","de"],["a","ma","ri","llo"],["na","ran","ja"],["vio","le","ta"],["ma","rrón"],
      ["ce","les","te"],["ro","sa"],["blan","co"],["ne","gro"],["mo","ra","do"],["li","la"],["fuc","sia"],["bei","ge"],
      ["ca","qui"],["púr","pu","ra"],["pla","te","a","do"],["do","ra","do"],["gris"],["tur","que","sa"],["a","ce","ro"],
      ["a","za","ba","che"],["a","gua","ma","ri","na"],["al","men","dra"],["ám","bar"],["a","ñil"],["ber","me","jo"],
      ["bron","ce"],["bor","dó"]
     ],
     music: [],
     geography: [],
     animals: [],
     nouns: [],
     verbs: [],
     adjetives: [],
     general: [],
   },
   kor: {
    colors: [
     []
    ],
    music: [],
    geography: [],
    animals: [],
    nouns: [],
    verbs: [],
    adjetives: [],
    general: [],
  },
  es: {
    colors: [
     []
    ],
    music: [],
    geography: [],
    animals: [],
    nouns: [],
    verbs: [],
    adjetives: [],
    general: [],
  },

 }
 */
  let random_words = [
      ["ro","jo"],["a","zul"],["ver","de"],["a","ma","ri","llo"],["na","ran","ja"],["vio","le","ta"],["ma","rrón"],
      ["ce","les","te"],["ro","sa"],["blan","co"],["ne","gro"],["mo","ra","do"],["li","la"],["fuc","sia"],["bei","ge"],
      ["ca","qui"],["púr","pu","ra"],["pla","te","a","do"],["do","ra","do"],["gris"],["tur","que","sa"],["a","ce","ro"],
      ["a","za","ba","che"],["a","gua","ma","ri","na"],["al","men","dra"],["ám","bar"],["a","ñil"],["ber","me","jo"],
      ["bron","ce"],["bor","dó"],["ca","fé"],["ca","ne","la"],["ca","o","ba"],["cian"],["car","me","sí"],["cre","ma"],
      ["co","ral"],["cas","ta","ño"],["cie","lo"],["é","ba","no"],["es","car","la","ta"],["es","me","ral","da"],
      ["ín","di","go"],["ja","de"],["li","ma"],["la","pis","lá","zu","li"],["li","món"],["la","van","da"],["ma","gen","ta"],
      
     ]
 

  let filteredWords = random_words.filter(word => !arraysAreEqual(word, prevWord));
  let randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
  return randomWord;
}