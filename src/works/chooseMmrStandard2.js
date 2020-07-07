const playerMmr =  {
 
  "_id": "mbcat#1703",
  
  "NA": {
    "QM": {
      "mmr": 2750,
      "games_played": 399
    },
    "SL": {
      "mmr": 2357,
      "games_played": 15
    }
  },
  "EU": null,
  "KR": {
    "QM": {
      "mmr": 2037,
      "games_played": 18
    },
    "SL": {
      "mmr": 2061,
      "games_played": 2
    }
  },
  "CN": null
    
}


const makeOrderRegion = (playerMmr) => {
  
	let listRegion = ["NA", "KR", "EU", "CN"];
	const listMode = ["SL", "QM"];
	
	let numGames {
	  "NA": 0,
	  "EU": 0,
	  "KR": 0,
	  "CN": 0
	}
	
	
	// check number of games (SL + QM) of each region
	listRegion.map((region)=>{
		listMode.map((mode)=>{
			
			if (playerMmr[region] && 
						playerMmr[region][mode] ) {
								
								numGames[region] += playerMmr[region][mode]['games_played'] 
								
							}
				
		})
	})
	
	// but sort change original array (listRegion)
	let orderRegion = listRegion.sort( (region1, region2) => { 
    return (numGames[region2] - numGames[region1]);
    // ex: 1,2,5,10,...
  });
	
	console.log(orderRegion)
	
	return orderRegion;
}







// mmr standard means mmr that we should expect from player in certain region.
const returnMmrStandardInEachRegion = (playerMmr, region, mmrDefault) => {
  
  const listRegion = ["NA", "KR", "EU", "CN"];
  
  const orderMode = ["SL", "QM"];
  const orderMinGames = [100, 40, 10];
  
  let mmrStandard;
  
  // order is based on number of games of certain Player on each region
  const orderRegionPersonal = makeOrderRegion(playerMmr);
  
  
  const moveElement = (array, indexFrom, indexTo) => {
    const element = array[indexFrom];
    array.splice(indexFrom, 1); // delete element
    array.splice(indexTo, 0, element); // add element  https://im-developer.tistory.com/103
    // splice change original array (unlike splice)
    return array;
  }
  
  const indexFrom = orderRegionPersonal.findIndex( region );
  const orderRegionFinal = moveElement(orderRegionPersonal, indexFrom, 0);
  
  
	// map 에서는 break 가 사용 불가능하다
	for (var iMinGames = 0; iMinGames < orderMinGames.length; iMinGames++) {
    for (var iRegion = 0; iRegion < orderRegionFinal.length; iRegion++) {
      for (var iMode = 0; iMode < orderMode.length; iMode++) {
        
        const minGames = orderMinGames[iMinGames];
        const region = orderRegionFinal[iRegion];
        const mode = orderMode[iMode];
        
        if (playerMmr[region] && 
							playerMmr[region][mode] &&
								playerMmr[region][mode]['games_played'] >= minGames) {
									
									console.log(`mmrStandard: ${playerMmr[region][mode]['mmr']} in ${region}, ${mode}`);
									
									mmrStandard = playerMmr[region][mode]['mmr'];
									break; // 일단 정해지면 다른 것들 볼 필요가 없으니 중지
								}
        
    
      }
    }
  }
	
	if (!mmrStandard) {
	  mmrStandard = mmrDefault
	  console.log("there is no mmr");
	}
	
	return mmrStandard;
	
}



const putMmrStandardToPlayerMmr = (playerMmr, mmrDefault) => {
  
  playerMmr["NA"]["STANDARD"] = returnMmrStandardInEachRegion(playerMmr, "NA", mmrDefault);
  playerMmr["EU"]["STANDARD"] = returnMmrStandardInEachRegion(playerMmr, "EU", mmrDefault);
  playerMmr["KR"]["STANDARD"] = returnMmrStandardInEachRegion(playerMmr, "KR", mmrDefault);
  playerMmr["CN"]["STANDARD"] = returnMmrStandardInEachRegion(playerMmr, "CN", mmrDefault);
  
  return playerMmr;
}





const resultExample =  {
 
  "_id": "mbcat#1703",
  
  "NA": {
    "STANDARD": 1000,  // if he/she plays in NA. use one of NA if possible, use one of other region else.
    "QM": {
      "mmr": 2750,
      "games_played": 399
    },
    "SL": {
      "mmr": 2357,
      "games_played": 15
    }
  },
  
  "EU": {"STANDARD": 1000},
  
  "KR": {
    "STANDARD": 1000,
    "QM": {
      "mmr": 2037,
      "games_played": 18
    },
    "SL": {
      "mmr": 2061,
      "games_played": 2
    }
  },
  
  "CN": {"STANDARD": 1000}
    
}









chooseMmrStandard(playerMmr);

export default chooseMmrStandard;