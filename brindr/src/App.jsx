import { useState, useEffect } from 'react'
import cardData from './data/cards.json';

import './App.css'

function App() {
  const [numBread, setNumBread] = useState(11);

  const [cards] = useState(cardData);
  const [breadImages, setBreadImages] = useState({});
  const [dragDist, setDragDist] = useState(0);
  const [start, setStart] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [topIndex, setTopIndex] = useState(Math.floor(Math.random() * numBread));
  const [secondIndex, setSecondIndex] = useState(Math.floor(Math.random() * numBread));
  const [reject, setReject] = useState(0);
  const [accept, setAccept] = useState(0);
  
  const makeCool = true;
  
  const handleMatch = (oldScore) => {
    if (isMouseDown) {
      setIsMouseDown(false);
      setDragDist(0);
      setStart(0);
      setTopIndex(secondIndex);
      setSecondIndex(Math.floor(Math.random() * numBread));
      
      setAccept(oldScore + 1)
      
    }
  }
  const handleReject = (oldScore) => {
    if (isMouseDown) {
      setIsMouseDown(false);
      setDragDist(0);
      setStart(0);
      setTopIndex(secondIndex);
      setSecondIndex(Math.floor(Math.random() * numBread));

      setReject(oldScore + 1)
    }
  }

  


  useEffect(() => {
    const handleDragStart = e => {
      setIsMouseDown(true);
      setDragDist(0);
      setStart(e.pageX);
    }
    const handleDragEnd = () => {
      setIsMouseDown(false);
      setDragDist(0);
      setStart(0);
    }
    
    const handleDrag = e => {
      if (isMouseDown) {
        const pageWidth = document.body.clientWidth;
        const dragLimit = pageWidth * 0.15;
        setDragDist(e.pageX - start);
        
        if (dragDist > dragLimit)
          handleReject(reject);
        else if (dragDist < -dragLimit)
          handleMatch(accept);
      }
    }
    const handleMouseMove = (e) => handleDrag(e);
    const handleTouchMove = (e) => handleDrag(e.touches[0]);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mouseup', handleDragEnd)
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mousedown', handleDragStart);
      document.removeEventListener('mouseup', handleDragEnd)
    };
  }, [dragDist, isMouseDown, start]);

  useEffect(() => {
    const importImages = async () => {
      
      for (let card of cardData) {
        const { default: breadImage } = await import(`./assets/profiles/${card.image}.png`);
        setBreadImages(prevImages => ({
          ...prevImages,
          [card.image]: breadImage
        }));
      }
      
    };
    
    importImages();
    
  }, []);

  const handleButtonMatch = (event) => {
    event.stopPropagation();
    setIsMouseDown(false);
      setDragDist(0);
      setStart(0);
      setTopIndex(secondIndex);
      setSecondIndex(Math.floor(Math.random() * numBread));
      
      setAccept(accepte => accepte + 1)
  }
  const handleButtonReject = (event) => {
    event.stopPropagation();
    handleReject(reject);
    setIsMouseDown(false);
      setDragDist(0);
      setStart(0);
      setTopIndex(secondIndex);
      setSecondIndex(Math.floor(Math.random() * numBread));

      setReject(rejecte => rejecte + 1)
  }
  return (
    <div className="app">
      <div className="background">
        <p className="backText">{accept}</p>
        <p className="backText">{reject}</p>
      </div>
      {cards.map((card, index) => (

        <div className={"card" + (index == topIndex ? " top " : "") + (dragDist == 0 ? " center " : "") + (index == secondIndex ? " second" : "")} key={index}
        style={((index == topIndex) ? {transform:`translateX(${dragDist}px) rotate(${dragDist * 0.005}deg) scale(1.1)`, '--colorAmount':`${dragDist  + 100}`} : {})}
        >
          
            <h2>{card.name}</h2>
          <img src={breadImages[card.image]} alt={card.image} draggable={false} />
          <div className="content">
            <h3>About Me:</h3>
            <hr />
            <p>{card.about}</p>
            <h3>Age:</h3>
            <hr />
            <p>{card.age}</p>
            <h3>Who I'm Looking For:</h3>
            <hr />
            <p>{card.lookingFor}</p>
            <h3>Fun Fact:</h3>
            <hr />
            <p>{card.funFact}</p>
            <h3>Hobbies:</h3>
            <hr />
            <p>{card.hobbies}</p>
            <h3>Best Feature:</h3>
            <hr />
            <p>{card.bestFeature}</p>

          </div>
          <div className="footer">
            <button onClick={handleButtonMatch}>+</button> 
            <button onClick={handleButtonReject}>-</button>
          </div>
        </div>

      ))}
    </div>
  );

}

export default App
