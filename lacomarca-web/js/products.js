/* Productos por partes del cerdo, extraídos del catálogo oficial
   (catalogo_lacomarca_esp_eng.pdf). Cada entrada = una ficha del catálogo.
   `zone` = zona del diagrama SVG (#pig en index.html).
   Para añadir/editar: { es: ['Nombre'], en: ['Name'], img: 'img/productos/xx.webp' } */
window.PRODUCT_PARTS = [
  {
    "zone": "cabeza",
    "es": "Cabeza",
    "en": "Head",
    "products": [
      {
        "es": [
          "Cabeza completa"
        ],
        "en": [
          "Whole head"
        ],
        "img": "img/productos/p06.webp"
      },
      {
        "es": [
          "Cabeza sin orejas sin carrillada"
        ],
        "en": [
          "Head without ears without cheek meat"
        ],
        "img": "img/productos/p07.webp"
      },
      {
        "es": [
          "Orejas A",
          "Orejas B",
          "Orejas sin oído"
        ],
        "en": [
          "Ears A",
          "Ears B",
          "Earflaps"
        ],
        "img": "img/productos/p08.webp"
      },
      {
        "es": [
          "Carrillada sin hueso",
          "Osobuco"
        ],
        "en": [
          "Cheek meat boneless",
          "Shank meat"
        ],
        "img": "img/productos/p09.webp"
      }
    ]
  },
  {
    "zone": "paletas",
    "es": "Paletas",
    "en": "Shoulders",
    "products": [
      {
        "es": [
          "Manos A",
          "Manos B"
        ],
        "en": [
          "Front feet A",
          "Front feet B"
        ],
        "img": "img/productos/p10.webp"
      },
      {
        "es": [
          "Paleta redonda S/M"
        ],
        "en": [
          "Shoulder bone in round cut without feet"
        ],
        "img": "img/productos/p11.webp"
      },
      {
        "es": [
          "Paleta redonda C/M"
        ],
        "en": [
          "Shoulder bone in round cut with feet"
        ],
        "img": "img/productos/p12.webp"
      },
      {
        "es": [
          "Paleta corte \"V\" S/M"
        ],
        "en": [
          "Shoulder bone in V cut without feet"
        ],
        "img": "img/productos/p13.webp"
      },
      {
        "es": [
          "Paleta corte \"V\" C/M"
        ],
        "en": [
          "Shoulder bone in V cut with feet"
        ],
        "img": "img/productos/p14.webp"
      },
      {
        "es": [
          "Paleta York"
        ],
        "en": [
          "Shoulder bone in York cut"
        ],
        "img": "img/productos/p15.webp"
      },
      {
        "es": [
          "Corteza paleta"
        ],
        "en": [
          "Shoulder rind"
        ],
        "img": "img/productos/p16.webp"
      },
      {
        "es": [
          "Paleta York s/codillo"
        ],
        "en": [
          "Shoulder bone in York cut without hock"
        ],
        "img": "img/productos/p17.webp"
      },
      {
        "es": [
          "Paleta 3D"
        ],
        "en": [
          "Shoulder 3D"
        ],
        "img": "img/productos/p18.webp"
      },
      {
        "es": [
          "Paleta 4D"
        ],
        "en": [
          "Shoulder 4D"
        ],
        "img": "img/productos/p19.webp"
      },
      {
        "es": [
          "Codillo paleta s/piel",
          "Codillo paleta c/piel"
        ],
        "en": [
          "Front hock rindless",
          "Front hock rind on"
        ],
        "img": "img/productos/p20.webp"
      }
    ]
  },
  {
    "zone": "chuletero",
    "es": "Chuletero",
    "en": "Middle-loin",
    "products": [
      {
        "es": [
          "Chuletero sin cabeza"
        ],
        "en": [
          "Loin bone in"
        ],
        "img": "img/productos/p21.webp"
      },
      {
        "es": [
          "Cinta lomo con cordón"
        ],
        "en": [
          "Loin boneless chain on"
        ],
        "img": "img/productos/p22.webp"
      },
      {
        "es": [
          "Secreto"
        ],
        "en": [
          "Secreto"
        ],
        "img": "img/productos/p23.webp"
      },
      {
        "es": [
          "Hueso de aguja"
        ],
        "en": [
          "Pork collar bone"
        ],
        "img": "img/productos/p24.webp"
      },
      {
        "es": [
          "Aguja con hueso"
        ],
        "en": [
          "Collars bone in"
        ],
        "img": "img/productos/p25.webp"
      },
      {
        "es": [
          "Aguja sin hueso"
        ],
        "en": [
          "Collars boneless"
        ],
        "img": "img/productos/p26.webp"
      },
      {
        "es": [
          "Solomillo c/cordón",
          "Solomillo s/cordón"
        ],
        "en": [
          "Tenderloin chain on",
          "Tenderloin chainless"
        ],
        "img": "img/productos/p27.webp"
      },
      {
        "es": [
          "Corteza lomo"
        ],
        "en": [
          "Back rind"
        ],
        "img": "img/productos/p28.webp"
      },
      {
        "es": [
          "Costilla tira"
        ],
        "en": [
          "Loin rib"
        ],
        "img": "img/productos/p29.webp"
      },
      {
        "es": [
          "Tocino lomo s/piel",
          "Tocino lomo c/piel"
        ],
        "en": [
          "Backfat skinless",
          "Backfat skin on"
        ],
        "img": "img/productos/p30.webp"
      }
    ]
  },
  {
    "zone": "panceta",
    "es": "Panceta",
    "en": "Middle-belly",
    "products": [
      {
        "es": [
          "Panceta industrial c/piel"
        ],
        "en": [
          "Belly boneless rind on"
        ],
        "img": "img/productos/p31.webp"
      },
      {
        "es": [
          "Panceta industrial s/piel"
        ],
        "en": [
          "Belly boneless rindless"
        ],
        "img": "img/productos/p32.webp"
      },
      {
        "es": [
          "Panceta con costilla s/piel"
        ],
        "en": [
          "Belly bone in rindless"
        ],
        "img": "img/productos/p33.webp"
      },
      {
        "es": [
          "Panceta con costilla c/piel"
        ],
        "en": [
          "Belly bone in rind on"
        ],
        "img": "img/productos/p34.webp"
      },
      {
        "es": [
          "Panceta lardón"
        ],
        "en": [
          "Lardon belly"
        ],
        "img": "img/productos/p35.webp"
      },
      {
        "es": [
          "Costilla semi",
          "Costilla carnuda"
        ],
        "en": [
          "Semi meaty spareribs",
          "Meaty spareribs"
        ],
        "img": "img/productos/p36.webp"
      }
    ]
  },
  {
    "zone": "jamon",
    "es": "Jamón",
    "en": "Leg",
    "products": [
      {
        "es": [
          "Patas A",
          "Patas B"
        ],
        "en": [
          "Hind feet A",
          "Hind feet B"
        ],
        "img": "img/productos/p37.webp"
      },
      {
        "es": [
          "Hueso de rabo con colín",
          "Hueso de rabo sin colín"
        ],
        "en": [
          "Tail bone with tail",
          "Tail bone without tail"
        ],
        "img": "img/productos/p38.webp"
      },
      {
        "es": [
          "Colines"
        ],
        "en": [
          "Tails"
        ],
        "img": "img/productos/p39.webp"
      },
      {
        "es": [
          "Jamón redondo S/P"
        ],
        "en": [
          "Leg bone in round cut without feet"
        ],
        "img": "img/productos/p40.webp"
      },
      {
        "es": [
          "Jamón redondo C/P"
        ],
        "en": [
          "Leg bone in round cut with feet"
        ],
        "img": "img/productos/p41.webp"
      },
      {
        "es": [
          "Jamón corte \"V\" S/P"
        ],
        "en": [
          "Leg bone in V cut without feet"
        ],
        "img": "img/productos/p42.webp"
      },
      {
        "es": [
          "Jamón corte \"V\" C/P"
        ],
        "en": [
          "Leg bone in V cut with feet"
        ],
        "img": "img/productos/p43.webp"
      },
      {
        "es": [
          "Jamón corte recto S/P"
        ],
        "en": [
          "Leg bone in straight cut without feet"
        ],
        "img": "img/productos/p44.webp"
      },
      {
        "es": [
          "Jamón corte recto C/P"
        ],
        "en": [
          "Leg bone in straight cut with feet"
        ],
        "img": "img/productos/p45.webp"
      },
      {
        "es": [
          "Jamón corte cuartino S/P"
        ],
        "en": [
          "Leg bone in quartine cut without feet"
        ],
        "img": "img/productos/p46.webp"
      },
      {
        "es": [
          "Jamón corte cuartino C/P"
        ],
        "en": [
          "Leg bone in quartine cut with feet"
        ],
        "img": "img/productos/p47.webp"
      },
      {
        "es": [
          "Jamón corte Hamburgo"
        ],
        "en": [
          "Leg bone in Hamburg cut"
        ],
        "img": "img/productos/p48.webp"
      },
      {
        "es": [
          "Jamón corte Lyon"
        ],
        "en": [
          "Leg bone in Lyon cut"
        ],
        "img": "img/productos/p49.webp"
      },
      {
        "es": [
          "Jamón corte Parma"
        ],
        "en": [
          "Leg bone in Parma cut"
        ],
        "img": "img/productos/p50.webp"
      },
      {
        "es": [
          "Jamón tipo York"
        ],
        "en": [
          "Leg bone in York cut"
        ],
        "img": "img/productos/p51.webp"
      },
      {
        "es": [
          "Jamón 3D"
        ],
        "en": [
          "Leg 3D"
        ],
        "img": "img/productos/p52.webp"
      },
      {
        "es": [
          "Jamón 4D"
        ],
        "en": [
          "Leg 4D"
        ],
        "img": "img/productos/p53.webp"
      },
      {
        "es": [
          "Jamón 5D"
        ],
        "en": [
          "Leg 5D"
        ],
        "img": "img/productos/p54.webp"
      },
      {
        "es": [
          "Codillo jamón s/piel",
          "Codillo jamón c/piel"
        ],
        "en": [
          "Hind hock rindless",
          "Hind hock rind on"
        ],
        "img": "img/productos/p55.webp"
      },
      {
        "es": [
          "Corteza jamón"
        ],
        "en": [
          "Leg rind"
        ],
        "img": "img/productos/p56.webp"
      }
    ]
  },
  {
    "zone": "otros",
    "es": "Otros",
    "en": "Others",
    "products": [
      {
        "es": [
          "Cuarto delantero"
        ],
        "en": [
          "Carcass fore-end"
        ],
        "img": "img/productos/p57.webp"
      },
      {
        "es": [
          "Cuartos traseros"
        ],
        "en": [
          "Carcass leg"
        ],
        "img": "img/productos/p58.webp"
      },
      {
        "es": [
          "Centros canal"
        ],
        "en": [
          "Carcass middle"
        ],
        "img": "img/productos/p59.webp"
      },
      {
        "es": [
          "Recortes de tocino y grasos"
        ],
        "en": [
          "Cutting fat"
        ],
        "img": "img/productos/p60.webp"
      },
      {
        "es": [
          "Papada con corteza",
          "Papada sin corteza"
        ],
        "en": [
          "Jowl rind on",
          "Jowl rindless"
        ],
        "img": "img/productos/p61.webp"
      },
      {
        "es": [
          "Magro 90/10"
        ],
        "en": [
          "Frozen pork pieces 90 VL"
        ],
        "img": "img/productos/p62.webp"
      },
      {
        "es": [
          "Magro 80/20"
        ],
        "en": [
          "Frozen pork pieces 80 VL"
        ],
        "img": "img/productos/p63.webp"
      },
      {
        "es": [
          "Magro 60/40"
        ],
        "en": [
          "Frozen pork pieces 60 VL"
        ],
        "img": "img/productos/p64.webp"
      },
      {
        "es": [
          "Magro TC (codillo)"
        ],
        "en": [
          "Shank meat"
        ],
        "img": "img/productos/p65.webp"
      },
      {
        "es": [
          "Magro ensangrentado"
        ],
        "en": [
          "Frozen pork bloody pieces"
        ],
        "img": "img/productos/p66.webp"
      },
      {
        "es": [
          "Magro de gañote",
          "Magro diafragma s/memb"
        ],
        "en": [
          "Frozen pork root piece",
          "Diaphragm without membrane"
        ],
        "img": "img/productos/p67.webp"
      },
      {
        "es": [
          "Palet jumbo box",
          "Palet bloque desnudo"
        ],
        "en": [
          "Pallets and logistic"
        ],
        "img": "img/productos/p68.webp"
      },
      {
        "es": [
          "Palet",
          "Palet"
        ],
        "en": [
          "Pallets and logistic"
        ],
        "img": "img/productos/p69.webp"
      }
    ]
  }
];
