import React, { useState, useEffect } from 'react';
import './App.css';
import { getImages, searchImages } from './api';

const App = () => {
  const [imageList, setImageList] = useState([]); //empty array becaus the data coming from the api should have the same properties
  const [nextCursor, setNextCursor] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const responseJson = await getImages();

      setImageList(responseJson.resources);
      setNextCursor(responseJson.next_cursor);
    }
    fetchData();
  }, []); //empty/dependency array

  const handleLoadMoreButtonClick = async () => {
    const responseJson = await getImages(nextCursor);

    setImageList((currentImageList) => [
      ...currentImageList,
      ...responseJson.resources
    ]);

    setNextCursor(responseJson.next_cursor);
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const responseJson = await searchImages(searchValue, nextCursor);

    setImageList(responseJson.resources);

    setNextCursor(responseJson.next_cursor);
  }
  
  const resetSearchForm = async ()=>{
    const responseJson = await getImages();
    setImageList(responseJson.resources);
    setNextCursor(responseJson.next_cursor);

    setSearchValue('');
  }

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <input
          value={searchValue}
          onChange={(event)=> setSearchValue(event.target.value)}
          require='required'
          placeholder='Search Images' />
        <button type='submit'>Search</button>
        <button type='button' onClick={resetSearchForm}>Cancel</button>
      </form>
      <div className="ImageGrid">
        {imageList.map((image) => <img key={image.asset_id} src={image.url} alt={image.public_id}></img>)}
      </div>
      <div className='footer'>
        {nextCursor && <button onClick={handleLoadMoreButtonClick}>Load More</button>}
      </div>
    </>
  );
}

export default App;
