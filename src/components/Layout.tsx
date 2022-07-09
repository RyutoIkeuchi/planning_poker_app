import { ReactNode } from 'react';

export const Layout = (props: { children: ReactNode }) => {
	return (
		<div className="container mx-auto max-w-2xl min-h-screen">
			{props.children}
		</div>
	);
};
