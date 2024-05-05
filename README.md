# Zania DND Cards App

## [Click here to view demo online](https://zania-dnd-cards.netlify.app/)

## Libraries used

React.js, Material-UI, React-DND, Jotai, and MSW

## Main features of the app

### 1. State management

The app uses jotai (atom) to maintain application state. All API requests are executed MSW and cached in local storage for faster performance. I have created a custom hook to make API requests and handle it's error/loading states.

On initial page load, cards will be fetched from server and rendered using CSS flex box.

### 2. Responsive design implementation

The app is responsive and works perfectly on mobile and desktop. In desktop cards ara arranged as 3 + 2 layout, and in mobile the cards are rendered one below the other.

### 3. Drag/Drop cards

Users can reorder the cards by simply using drag and drop. Changes will be persisted even after page is reloaded. MSW and localStorage is used to achieve this.

### 3. Image shows a circular loading spinner while it is loading

Images will show a circular loading spinner animation. Once image is loaded from the network then the loading animation will stop. The onLoad and onError props of image tag are used to determine when the image has stopped loading from the network.

### 4. API implementation

Using MSW library I have implemented and used 2 API's - fetch cards, and reorder cards. I have also implemented the API's for create/update/delete card and these can be used in the app in future if needed.

### 5. Image shown in overlay on click

If you click on any card it will show that card's image in a popup overlay. You can click cancel button or press escape on keyboard to close the overlay popup.

### 6. Auto save using timer

The current state of the cards will be auto-saved every 5 seconds. A loading spinner will be shown beside the save button, and the last saved timestamp is also shown beside the button. If there are no changes in the cards then save API will not be called for performance reasons.
