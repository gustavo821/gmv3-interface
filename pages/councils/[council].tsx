import BackButton from 'components/BackButton';
import NominateSelfBanner from 'components/Banners/NominateSelfBanner';
import { Loader } from 'components/Loader/Loader';
import Main from 'components/Main';
import MemberCard from 'components/MemberCard/Index';
import {
	ArrowDropdownLeftIcon,
	ArrowDropdownRightIcon,
	SkipLeftIcon,
	SkipRightIcon,
} from 'components/old-ui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useUsersDetailsQuery from 'queries/boardroom/useUsersDetailsQuery';
import useIsNominatedForCouncilInNominationPeriod from 'queries/nomination/useIsNominatedForCouncilInNominationPeriod';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeString } from 'utils/capitalize';
import { parseQuery } from 'utils/parse';
import { useAccount } from 'wagmi';

export default function CouncilNominees() {
	const { query } = useRouter();
	const { t } = useTranslation();
	const { data } = useAccount();
	const [activePage, setActivePage] = useState(8);
	const activeCouncil = parseQuery(query?.council?.toString());
	const nomineesQuery = useNomineesQuery(activeCouncil.module);
	const isNominatedQuery = useIsNominatedForCouncilInNominationPeriod(data?.address || '');
	const nomineesInfo = useUsersDetailsQuery(nomineesQuery.data || []);
	const paginatedNominees = (startIndex: number, endIndex: number) => {
		return nomineesInfo.data?.slice(startIndex, endIndex);
	};

	return (
		<>
			<Head>
				<title>Synthetix | Governance V3</title>
			</Head>
			<Main>
				{!isNominatedQuery.data?.length && (
					<NominateSelfBanner deployedModule={activeCouncil.module} />
				)}
				<div className="w-full relative mt-10">
					<BackButton />
					<h1 className="tg-title-h1 text-center">
						{t('councils.nominees', { council: capitalizeString(query.council?.toString()) })}
					</h1>
				</div>
				<span className="tg-content text-gray-500 text-center block pt-[8px] mb-4 p-2">
					{t('councils.subline')}
				</span>
				{nomineesInfo.isLoading && !nomineesInfo.data ? (
					<Loader className="flex justify-center" />
				) : !!nomineesInfo.data?.length ? (
					<>
						<div className="flex flex-wrap justify-center p-3 max-w-[1000px] mx-auto">
							{paginatedNominees(activePage - 8, activePage)?.map((member) => (
								<MemberCard
									className="m-2"
									member={member}
									key={member.address}
									state="NOMINATION"
									deployedModule={activeCouncil.module}
									council={activeCouncil.name}
								/>
							))}
						</div>
						<div className="w-full flex justify-around items-center gap-5 max-w-[330px] mx-auto pb-40">
							<SkipLeftIcon
								active={activePage > 8}
								onClick={() => setActivePage(8)}
								className="cursor-pointer"
							/>
							<ArrowDropdownLeftIcon
								className="cursor-pointer"
								onClick={() => setActivePage(activePage - 8 < 8 ? 8 : activePage - 8)}
								active={activePage > 8}
							></ArrowDropdownLeftIcon>
							<h6 className="tg-title-h6 text-gray-500">
								{activePage - 7 > 0 ? activePage - 7 : 1}-{nomineesInfo.data.length}&nbsp;
								{t('councils.of')}&nbsp;
								{nomineesInfo.data.length}
							</h6>
							<ArrowDropdownRightIcon
								className="cursor-pointer"
								active={activePage < nomineesInfo.data.length}
								onClick={() =>
									setActivePage(
										activePage + 8 < nomineesInfo.data.length
											? activePage + 8
											: nomineesInfo.data.length
									)
								}
							></ArrowDropdownRightIcon>
							<SkipRightIcon
								active={activePage < nomineesInfo.data.length}
								onClick={() => setActivePage(nomineesInfo.data.length)}
								className="cursor-pointer"
							/>
						</div>
					</>
				) : (
					<h4 className="tg-title-h4 text-center">{t('councils.no-nominations')}</h4>
				)}
			</Main>
		</>
	);
}
