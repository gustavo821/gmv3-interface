import { IconButton } from '@synthetixio/ui';
import { CloseIcon } from 'components/old-ui';
import { useModalContext } from 'containers/Modal';
import { PropsWithChildren, useEffect } from 'react';

export default function BaseModal({ children, headline }: PropsWithChildren<{ headline: string }>) {
	const { setIsOpen, isOpen } = useModalContext();

	useEffect(() => {
		if (isOpen) {
			document.documentElement.scroll(0, 0);
			document.documentElement.classList.add('stop-scrolling');
		} else document.documentElement.classList.remove('stop-scrolling');
	}, [isOpen]);

	return (
		<div className="bg-purple p-1 rounded-[2rem]">
			<div className=" flex flex-col items-center darker-60 rounded-[2rem] min-h-screen">
				<IconButton
					className="top-[20px] right-[20px] absolute"
					onClick={() => {
						document.documentElement.classList.remove('stop-scrolling');
						setIsOpen(false);
					}}
					rounded
					size="sm"
				>
					<CloseIcon active />
				</IconButton>
				<h2 className="tg-title-h2 text-white md:mt-24 mt-20 text-center">{headline}</h2>
				{children}
			</div>
		</div>
	);
}
