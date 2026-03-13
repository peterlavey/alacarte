const santiagoRestaurants = [
  {
    lat: -33.4372,
    lon: -70.6506,
    content: "https://www.google.com/search?q=Mercado+Central+Santiago+Menu",
    name: "Mercado Central"
  },
  {
    lat: -33.4444,
    lon: -70.6344,
    content: "https://www.liguria.cl/cartas-en-pdf/",
    name: "Bar Liguria (Lastarria)"
  },
  {
    lat: -33.4189,
    lon: -70.6033,
    content: "https://tiramisu.cl/nuestra-carta/",
    name: "Pizzeria Tiramisu"
  },
  {
    lat: -33.4331,
    lon: -70.6353,
    content: "https://www.google.com/search?q=Patio+Bellavista+Menus",
    name: "Patio Bellavista"
  },
  {
    lat: -33.4026,
    lon: -70.5786,
    content: "https://www.borago.cl/",
    name: "Boragó"
  },
  {
    lat: -33.4429,
    lon: -70.6439,
    content: "https://confiteriatorres.cl/carta/",
    name: "Confitería Torres"
  },
  {
    lat: -33.4214,
    lon: -70.6083,
    content: "https://www.google.com/search?q=Baco+Vino+Bistro+Santiago+Menu",
    name: "Baco Vino y Bistro"
  },
  {
    lat: -33.4447,
    lon: -70.6275,
    content: "https://www.la-diana.cl/carta",
    name: "La Diana"
  },
  {
    lat: -33.4354,
    lon: -70.6385,
    content: "https://www.google.com/search?q=Galindo+Santiago+Menu",
    name: "Galindo"
  },
  {
    lat: -33.4208,
    lon: -70.6122,
    content: "https://giratorio.cl/la-carta/",
    name: "Giratorio Restaurant"
  },
  {
      lat: -33.3995,
      lon: -70.5788,
      content: "https://www.instagram.com/p/CoI-j8PuS4Z/",
      name: "Mestizo"
  },
  {
      lat: -33.4485,
      lon: -70.6288,
      content: "https://www.google.com/search?q=Barrio+Italia+Santiago+Menus",
      name: "Barrio Italia (Generic)"
  },
  {
    lat: -33.4442,
    lon: -70.6358,
    content: "https://www.google.com/search?q=Bocanariz+Lastarria+Menu",
    name: "Bocanáriz"
  },
  {
    lat: -33.4446,
    lon: -70.6354,
    content: "https://www.google.com/search?q=Chipe+Libre+Lastarria+Menu",
    name: "Chipe Libre"
  },
  {
    lat: -33.4241,
    lon: -70.6171,
    content: "https://www.google.com/search?q=Aqui+esta+Coco+Santiago+Menu",
    name: "Aquí está Coco"
  },
  {
    lat: -33.4172,
    lon: -70.6061,
    content: "https://www.google.com/search?q=Le+Bistrot+de+Gaetan+Menu",
    name: "Le Bistrot de Gaëtan"
  },
  {
    lat: -33.4005,
    lon: -70.5982,
    content: "https://www.google.com/search?q=Peluqueria+Francesa+Santiago+Menu",
    name: "Peluquería Francesa (Boulevard Lavaud)"
  },
  {
    lat: -33.4391,
    lon: -70.6652,
    content: "https://www.google.com/search?q=Ocean+Pacifics+Santiago+Menu",
    name: "Ocean Pacific's"
  },
  {
    lat: -33.4352,
    lon: -70.6412,
    content: "https://www.google.com/search?q=Sarita+Colonia+Santiago+Menu",
    name: "Sarita Colonia"
  },
  {
    lat: -33.4234,
    lon: -70.6111,
    content: "https://www.google.com/search?q=Rivoli+Providencia+Menu",
    name: "Rivoli"
  },
  {
    lat: -33.3912,
    lon: -70.5921,
    content: "https://www.google.com/search?q=La+Mar+Cebicheria+Santiago+Menu",
    name: "La Mar"
  },
  {
    lat: -33.4421,
    lon: -70.6302,
    content: "https://www.google.com/search?q=The+Singular+Santiago+Bar+Menu",
    name: "The Singular Bar"
  },
  {
    lat: -33.4165,
    lon: -70.5982,
    content: "https://www.google.com/search?q=Happening+Costanera+Menu",
    name: "Happening"
  },
  {
    lat: -33.4182,
    lon: -70.6055,
    content: "https://www.google.com/search?q=Nolita+Isidora+Goyenechea+Menu",
    name: "Nolita"
  },
  {
    lat: -33.4472,
    lon: -70.6281,
    content: "https://www.google.com/search?q=Silvestre+Bistro+Santiago+Menu",
    name: "Silvestre Bistro"
  },
  {
    lat: -33.4491,
    lon: -70.6272,
    content: "https://www.google.com/search?q=Da+Noi+Barrio+Italia+Menu",
    name: "Da Noi"
  },
  {
    lat: -33.4482,
    lon: -70.6295,
    content: "https://www.google.com/search?q=Invernadero+Barrio+Italia+Menu",
    name: "Invernadero"
  },
  {
    lat: -33.4348,
    lon: -70.6402,
    content: "https://www.google.com/search?q=Krossbar+Bellavista+Menu",
    name: "Krossbar Bellavista"
  },
  {
    lat: -33.4225,
    lon: -70.6098,
    content: "https://www.google.com/search?q=Krossbar+Orrego+Luco+Menu",
    name: "Krossbar Providencia"
  },
  {
    lat: -33.4335,
    lon: -70.6361,
    content: "https://www.google.com/search?q=Uncle+Fletch+Bellavista+Menu",
    name: "Uncle Fletch Bellavista"
  },
  {
    lat: -33.4175,
    lon: -70.5991,
    content: "https://www.google.com/search?q=Ambrosia+Bistro+Providencia+Menu",
    name: "Ambrosía Bistro"
  },
  {
    lat: -33.4361,
    lon: -70.6482,
    content: "https://www.google.com/search?q=Don+Victorio+Santiago+Centro+Menu",
    name: "Don Victorio"
  },
  {
    lat: -33.4402,
    lon: -70.6515,
    content: "https://www.google.com/search?q=El+Hoyo+Santiago+Menu",
    name: "El Hoyo"
  },
  {
    lat: -33.4415,
    lon: -70.6521,
    content: "https://www.google.com/search?q=Las+Lanzas+Santiago+Menu",
    name: "Las Lanzas"
  },
  {
    lat: -33.4212,
    lon: -70.6135,
    content: "https://www.google.com/search?q=Bar+Nacional+Santiago+Menu",
    name: "Bar Nacional"
  },
  {
    lat: -33.4428,
    lon: -70.6462,
    content: "https://www.google.com/search?q=Casino+Social+J+R+Menu",
    name: "Casino Social J.R."
  },
  // --- EXPANSIÓN MASIVA ---
  // Ñuñoa (Plaza Ñuñoa)
  { lat: -33.4542, lon: -70.5976, name: "La Tecla", content: "https://www.latecla.cl/carta" },
  { lat: -33.4545, lon: -70.5982, name: "El Mesón del Buen Comer", content: "https://www.google.com/search?q=El+Meson+del+Buen+Comer+Menu" },
  { lat: -33.4538, lon: -70.5968, name: "Bar de René (Ñuñoa)", content: "https://www.google.com/search?q=Bar+de+Rene+Menu" },
  { lat: -33.4548, lon: -70.5971, name: "Las Lanzas Plaza Ñuñoa", content: "https://www.google.com/search?q=Las+Lanzas+Plaza+Nunoa+Menu" },
  { lat: -33.4532, lon: -70.5985, name: "Underground Bar", content: "https://www.google.com/search?q=Underground+Bar+Nunoa+Menu" },
  { lat: -33.4551, lon: -70.5979, name: "Hops", content: "https://www.google.com/search?q=Hops+Nunoa+Menu" },
  
  // Maipú (Plaza de Maipú / Pajaritos)
  { lat: -33.5104, lon: -70.7572, name: "El Palacio del Choclo", content: "https://www.google.com/search?q=El+Palacio+del+Choclo+Maipu+Menu" },
  { lat: -33.5112, lon: -70.7585, name: "Fuente Maipú", content: "https://www.google.com/search?q=Fuente+Maipu+Menu" },
  { lat: -33.5095, lon: -70.7561, name: "Bar Central Maipú", content: "https://www.google.com/search?q=Bar+Central+Maipu+Menu" },
  { lat: -33.5125, lon: -70.7592, name: "Pizzería La Nostra", content: "https://www.google.com/search?q=Pizzeria+La+Nostra+Maipu+Menu" },
  
  // La Florida (Vicente Valdés / Plaza Vespucio)
  { lat: -33.5218, lon: -70.5982, name: "Johnny Rockets Mall Plaza Vespucio", content: "https://www.johnnyrockets.cl/nuestra-carta/" },
  { lat: -33.5225, lon: -70.5975, name: "Tanta Plaza Vespucio", content: "https://www.google.com/search?q=Tanta+Plaza+Vespucio+Menu" },
  { lat: -33.5231, lon: -70.5991, name: "Schopdog La Florida", content: "https://www.google.com/search?q=Schopdog+La+Florida+Menu" },
  { lat: -33.5205, lon: -70.6012, name: "Mamut Restaurant", content: "https://www.mamut.cl/carta/" },

  // Providencia (Manuel Montt / Tobalaba)
  { lat: -33.4278, lon: -70.6205, name: "Liguria Manuel Montt", content: "https://www.liguria.cl/cartas-en-pdf/" },
  { lat: -33.4285, lon: -70.6212, name: "Little Tokyo", content: "https://www.google.com/search?q=Little+Tokyo+Manuel+Montt+Menu" },
  { lat: -33.4265, lon: -70.6191, name: "Bar de René", content: "https://www.google.com/search?q=Bar+de+Rene+Providencia+Menu" },
  { lat: -33.4292, lon: -70.6218, name: "Rambla Bar", content: "https://www.google.com/search?q=Rambla+Bar+Providencia+Menu" },
  { lat: -33.4185, lon: -70.6025, name: "Pizzería Tiramisu 2", content: "https://tiramisu.cl/nuestra-carta/" },
  { lat: -33.4192, lon: -70.6011, name: "Kilómetro 0", content: "https://www.google.com/search?q=Kilometro+0+Santiago+Menu" },

  // Santiago Centro (Paseo Ahumada / Huérfanos)
  { lat: -33.4395, lon: -70.6502, name: "El Rápido", content: "https://www.google.com/search?q=El+Rapido+Santiago+Centro+Menu" },
  { lat: -33.4408, lon: -70.6485, name: "Bar Nacional 2", content: "https://www.google.com/search?q=Bar+Nacional+Huérfanos+Menu" },
  { lat: -33.4382, lon: -70.6518, name: "Don Victorio Centro", content: "https://www.google.com/search?q=Don+Victorio+Centro+Menu" },
  { lat: -33.4412, lon: -70.6472, name: "Naturista", content: "https://www.google.com/search?q=Restaurante+Naturista+Santiago+Menu" },
  { lat: -33.4375, lon: -70.6525, name: "La Piojera", content: "https://www.google.com/search?q=La+Piojera+Menu" },

  // Vitacura (Alonso de Córdova / Nueva Costanera)
  { lat: -33.4012, lon: -70.5815, name: "Osaka", content: "https://大阪 Osaka Menu" },
  { lat: -33.4028, lon: -70.5822, name: "Coquinaria", content: "https://www.google.com/search?q=Coquinaria+Vitacura+Menu" },
  { lat: -33.4035, lon: -70.5801, name: "Cuerovaca", content: "https://www.google.com/search?q=Cuerovaca+Menu" },
  { lat: -33.4042, lon: -70.5795, name: "Miraolas", content: "https://www.google.com/search?q=Miraolas+Vitacura+Menu" },

  // Las Condes (El Golf / Escuela Militar)
  { lat: -33.4145, lon: -70.5962, name: "Flannery's Irish Geo", content: "https://www.google.com/search?q=Flannerys+Irish+Geo+Menu" },
  { lat: -33.4152, lon: -70.5955, name: "Tavelli El Golf", content: "https://www.tavelli.cl/carta/" },
  { lat: -33.4138, lon: -70.5978, name: "Zanzibar", content: "https://www.google.com/search?q=Zanzibar+Santiago+Menu" },

  // Peñalolén (Consistorial / Paseo Quilín)
  { lat: -33.4852, lon: -70.5562, name: "Mestizo Peñalolén", content: "https://www.google.com/search?q=Mestizo+Penalolen+Menu" },
  { lat: -33.4865, lon: -70.5575, name: "La Cabaña de Peñalolén", content: "https://www.google.com/search?q=La+Cabana+Penalolen+Menu" },
  { lat: -33.4841, lon: -70.5588, name: "Pizza Hut Quilín", content: "https://www.pizzahut.cl/" },

  // San Miguel (Gran Avenida)
  { lat: -33.4982, lon: -70.6515, name: "D'Alfredo Pizzería", content: "https://www.google.com/search?q=D+Alfredo+San+Miguel+Menu" },
  { lat: -33.4995, lon: -70.6528, name: "Bar de la Gran Avenida", content: "https://www.google.com/search?q=Bar+Gran+Avenida+Menu" },

  // Macul (Av. Macul)
  { lat: -33.4825, lon: -70.6012, name: "La Picá de Macul", content: "https://www.google.com/search?q=La+Pica+de+Macul+Menu" },
  { lat: -33.4838, lon: -70.6025, name: "Sushi House Macul", content: "https://www.sushihouse.cl/" },

  // Huechuraba (Ciudad Empresarial)
  { lat: -33.3752, lon: -70.6125, name: "Starbucks Ciudad Empresarial", content: "https://www.starbucks.cl/menu/" },
  { lat: -33.3765, lon: -70.6138, name: "L'Incontro Ciudad Empresarial", content: "https://www.google.com/search?q=L+Incontro+Ciudad+Empresarial+Menu" },

  // Quilicura (Lo Boza / San Ignacio)
  { lat: -33.3452, lon: -70.7215, name: "Mcdonald's Quilicura", content: "https://www.mcdonalds.cl/menu" },
  { lat: -33.3465, lon: -70.7228, name: "Dunkin' Quilicura", content: "https://www.dunkinchile.cl/menu" },

  // Estación Central
  { lat: -33.4512, lon: -70.6815, name: "El Palacio de la Chorrillana", content: "https://www.google.com/search?q=El+Palacio+de+la+Chorrillana+Menu" },
  { lat: -33.4525, lon: -70.6828, name: "San Camilo Estación Central", content: "https://www.sancamilo.cl/" },

  // Recoleta (Patronato / La Vega)
  { lat: -33.4282, lon: -70.6485, name: "Don Gaviota", content: "https://www.dongaviota.cl/carta" },
  { lat: -33.4295, lon: -70.6498, name: "Café de la Vega", content: "https://www.google.com/search?q=Cafe+de+la+Vega+Menu" },

  // Independencia
  { lat: -33.4215, lon: -70.6582, name: "Hipódromo Chile Restaurante", content: "https://www.google.com/search?q=Hipodromo+Chile+Restaurante+Menu" },

  // Lo Barnechea (La Dehesa)
  { lat: -33.3512, lon: -70.5185, name: "Rubaiyat La Dehesa", content: "https://www.google.com/search?q=Rubaiyat+La+Dehesa+Menu" },
  { lat: -33.3525, lon: -70.5198, name: "Tanta La Dehesa", content: "https://www.google.com/search?q=Tanta+La+Dehesa+Menu" },

  // Pudahuel (Enea)
  { lat: -33.4352, lon: -70.7815, name: "Hilton Garden Inn Restaurant", content: "https://www.google.com/search?q=Hilton+Garden+Inn+Pudahuel+Menu" },

  // Cerrillos (Mall Plaza Oeste)
  { lat: -33.5152, lon: -70.7185, name: "P.F. Chang's Mall Plaza Oeste", content: "https://www.pfchangs.cl/menu" },
  { lat: -33.5165, lon: -70.7198, name: "Applebee's Mall Plaza Oeste", content: "https://www.google.com/search?q=Applebees+Mall+Plaza+Oeste+Menu" },

  // Puente Alto (Plaza de Puente Alto)
  { lat: -33.6112, lon: -70.5752, name: "Dino's Puente Alto", content: "https://www.google.com/search?q=Dinos+Puente+Alto+Menu" },
  { lat: -33.6125, lon: -70.5765, name: "La Picá del Muertito", content: "https://www.google.com/search?q=La+Pica+del+Muertito+Puente+Alto+Menu" },

  // Padre Hurtado / Peñaflor (Cercanías)
  { lat: -33.5712, lon: -70.8185, name: "Don de Juan", content: "https://www.google.com/search?q=Don+de+Juan+Menu" },

  // San Bernardo (Plaza de San Bernardo)
  { lat: -33.5912, lon: -70.7015, name: "Club de la Unión San Bernardo", content: "https://www.google.com/search?q=Club+de+la+Union+San+Bernardo+Menu" },
  { lat: -33.5925, lon: -70.7028, name: "Pizzería Las 4 Estaciones", content: "https://www.google.com/search?q=Pizzeria+Las+4+Estaciones+San+Bernardo+Menu" },

  // Lampa (Valle Grande)
  { lat: -33.3012, lon: -70.7585, name: "Sabor a Campo", content: "https://www.google.com/search?q=Sabor+a+Campo+Lampa+Menu" },

  // Colina (Chicureo)
  { lat: -33.2812, lon: -70.6815, name: "Baco Chicureo", content: "https://www.google.com/search?q=Baco+Chicureo+Menu" },
  { lat: -33.2825, lon: -70.6828, name: "Starbucks Chicureo", content: "https://www.starbucks.cl/menu/" },

  // Melipilla (Pomaire)
  { lat: -33.6512, lon: -71.1585, name: "San Antonio Pomaire", content: "https://www.google.com/search?q=San+Antonio+Pomaire+Menu" },
  { lat: -33.6525, lon: -71.1598, name: "Mi Tierra Pomaire", content: "https://www.google.com/search?q=Mi+Tierra+Pomaire+Menu" },

  // Pirque
  { lat: -33.6312, lon: -70.5815, name: "Las Majadas de Pirque Restaurant", content: "https://www.lasmajadas.cl/restaurant/" },
  { lat: -33.6325, lon: -70.5828, name: "Concha y Toro Wine Bar", content: "https://www.conchaytoro.com/wine-bar/" },

  // Buin
  { lat: -33.7312, lon: -70.7415, name: "Buin Zoo Restaurant", content: "https://www.buinzoo.cl/" },

  // Talagante
  { lat: -33.6612, lon: -70.9285, name: "Las Palmeras de Talagante", content: "https://www.google.com/search?q=Las+Palmeras+Talagante+Menu" },

  // Paine
  { lat: -33.8112, lon: -70.7415, name: "Sandía de Paine Restaurante", content: "https://www.google.com/search?q=Sandia+de+Paine+Restaurante+Menu" },

  // San José de Maipo (Cajón del Maipo)
  { lat: -33.6412, lon: -70.5815, name: "Casa Bosque", content: "https://www.google.com/search?q=Casa+Bosque+Cajon+del+Maipo+Menu" },
  { lat: -33.6812, lon: -70.3585, name: "El Morado Lodge Restaurant", content: "https://www.elmorado.cl/" },
  { lat: -33.6012, lon: -70.5285, name: "Prana Cajón del Maipo", content: "https://www.google.com/search?q=Prana+Cajon+del+Maipo+Menu" },

  // Más Ñuñoa (Irarrázaval)
  { lat: -33.4532, lon: -70.6125, name: "Golfo Di Napoli", content: "https://www.google.com/search?q=Golfo+Di+Napoli+Nunoa+Menu" },
  { lat: -33.4545, lon: -70.6138, name: "La Fuente Suiza", content: "https://www.lafuentesuiza.cl/carta/" },

  // Más Providencia (Pedro de Valdivia)
  { lat: -33.4352, lon: -70.6115, name: "Hamburgo", content: "https://www.google.com/search?q=Hamburgo+Providencia+Menu" },
  { lat: -33.4365, lon: -70.6128, name: "De la Ostia", content: "https://www.google.com/search?q=De+la+Ostia+Providencia+Menu" },

  // Más Vitacura (Pueblo del Inglés)
  { lat: -33.3982, lon: -70.5715, name: "Fajita Express Pueblito", content: "https://www.fajitaexpress.cl/" },

  // Más Las Condes (Apoquindo)
  { lat: -33.4112, lon: -70.5715, name: "Dominó Apoquindo", content: "https://www.domino.cl/carta/" },
  { lat: -33.4125, lon: -70.5728, name: "Juan Maestro Apoquindo", content: "https://www.juanmaestro.cl/menu" },

  // Más Santiago Centro (Lastarria Extendido)
  { lat: -33.4392, lon: -70.6385, name: "Mulato", content: "https://www.google.com/search?q=Mulato+Lastarria+Menu" },
  { lat: -33.4405, lon: -70.6398, name: "Urriola", content: "https://www.google.com/search?q=Urriola+Lastarria+Menu" },

  // Más Barrio Italia (Extendido)
  { lat: -33.4502, lon: -70.6265, name: "Mamma Pizza", content: "https://www.google.com/search?q=Mamma+Pizza+Barrio+Italia+Menu" },
  { lat: -33.4515, lon: -70.6278, name: "Chipe Libre Barrio Italia", content: "https://www.google.com/search?q=Chipe+Libre+Barrio+Italia+Menu" },

  // Más Maipú (Ciudad Satélite)
  { lat: -33.5512, lon: -70.8015, name: "Pizzería Ciudad Satélite", content: "https://www.google.com/search?q=Pizzeria+Ciudad+Satelite+Maipu+Menu" },

  // Más La Florida (Walker Martínez)
  { lat: -33.5112, lon: -70.5815, name: "Los Buenos Muchachos La Florida", content: "https://www.losbuenosmuchachos.cl/carta/" },

  // Más San Miguel (El Llano)
  { lat: -33.4882, lon: -70.6515, name: "Nippon Sushi San Miguel", content: "https://www.nipponsushi.cl/" },

  // Más Macul (Quilín)
  { lat: -33.4912, lon: -70.5715, name: "Pedro, Juan y Diego Mall Quilín", content: "https://www.pjyd.cl/menu" },

  // Más Peñalolén (Rotonda Grecia)
  { lat: -33.4612, lon: -70.5615, name: "Schopdog Rotonda Grecia", content: "https://www.google.com/search?q=Schopdog+Rotonda+Grecia+Menu" },

  // Más Recoleta (Bellavista Norte)
  { lat: -33.4322, lon: -70.6365, name: "Santería", content: "https://www.google.com/search?q=Santeria+Bellavista+Menu" },

  // Más Independencia (Mall Barrio Independencia)
  { lat: -33.4242, lon: -70.6615, name: "Tony Roma's Independencia", content: "https://www.google.com/search?q=Tony+Romas+Independencia+Menu" },

  // Más Lo Barnechea (Portal La Dehesa)
  { lat: -33.3612, lon: -70.5115, name: "Cinnabon Portal La Dehesa", content: "https://www.cinnabon.cl/" },

  // Más Pudahuel (Aeropuerto)
  { lat: -33.3912, lon: -70.7915, name: "Gatsby Aeropuerto", content: "https://www.google.com/search?q=Gatsby+Aeropuerto+Santiago+Menu" },

  // Más Cerrillos (Ciudad Parque Bicentenario)
  { lat: -33.5012, lon: -70.7015, name: "Punto de Encuentro Cerrillos", content: "https://www.google.com/search?q=Punto+de+Encuentro+Cerrillos+Menu" }
];

export default santiagoRestaurants;
