import axios from 'axios';

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

api.interceptors.response.use(
	(response) => {
		return response;
	},
	function (error) {
		switch (error.response.status) {
			case 400:
			case 401:
			case 404:
			default:
		}
	}
);