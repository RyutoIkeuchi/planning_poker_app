export const RoomContainer = () => {

	const createRoomId = () => {
		let randomId = Math.floor(Math.random() * 1000000);
		while (randomId.toString().length != 6) {
			randomId = Math.floor(Math.random() * 1000000);
		}
		console.log(randomId);
  };
  
	return (
		<div>
			<button onClick={createRoomId}>部屋を作る</button>
			<p className="text-blue-400">部屋に入る</p>
		</div>
	);
};
