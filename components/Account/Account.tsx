import { HTMLAttributes, useState, useContext, useEffect } from 'react';
import QRCode from 'react-qr-code';

import styles from './Account.module.scss';
import { WalletContext } from '@contexts/wallet';
import AddressActionButton from '@components/AddressActionButton/AddressActionButton';
import TokenCard from '@components/TokenCard/TokenCard';
import Dropdown from '@components/Dropdown/Dropdown';
import Wallets from '@components/Wallets/Wallets';
import Loader from '@components/Loader/Loader';
import Button from '@components/Button/Button';
import Card from '@components/Card/Card';
import ArrowLeft from '@icons/arrow_left.svg';
import QR from '@icons/qr_code.svg';
import Copy from '@icons/copy.svg';
import { ChainDropdownOptions } from '@constants/chains';
import { ArrayElement } from 'types/general';

type AccountProps = {} & HTMLAttributes<HTMLDivElement>;

const Account = ({ className, ...other }: AccountProps) => {
	const [showQR, setShowQR] = useState(false);
	const [selectedOption, setSelectedOption] = useState<ArrayElement<typeof ChainDropdownOptions>>(
		ChainDropdownOptions[0],
	);
	const { wallet, updateWallet, fetchAssets, logoutWallet } = useContext(WalletContext);

	const onChainSelected = (option: any) => setSelectedOption(option);

	useEffect(() => {
		fetchAssets();
	}, []);

	return (
		<div className={styles.account}>
			{showQR ? <ArrowLeft width={20} height={20} color="black" onClick={() => setShowQR(false)} /> : <div />}
			{wallet.user ? (
				<>
					<p className={styles.name}>{wallet.user.name ?? 'Hi'}</p>
					{showQR ? (
						<div className={styles.qrContainer}>
							<QRCode value={wallet.user.address} size={150} />
							<AddressActionButton address={wallet.user.address} ButtonLogo={Copy} wrapButtonWithCopy={true} />
						</div>
					) : (
						<>
							<div className={styles.flex}>
								<AddressActionButton
									address={wallet.user.address}
									ButtonLogo={QR}
									buttonOnClick={() => setShowQR(true)}
								/>
								<p className={styles.label}>Select chain:</p>
								<Dropdown
									defaultValue={selectedOption}
									onChange={onChainSelected}
									options={ChainDropdownOptions}
									placeholder={null}
									name="chain"
									withLogos={true}
								/>
								<p className={styles.label}>Available:</p>
								<Card className={styles.available}>
									{wallet.balances?.balances?.length ? (
										wallet.balances.balances.map((token) => <TokenCard token={token} key={token.denom} />)
									) : wallet.balances?.loading ? (
										<Loader size={30} className={styles.loader} />
									) : (
										<p className={styles.noBalances}>No Balances to Show</p>
									)}
								</Card>
							</div>
							<Button label="logout" onClick={logoutWallet} />
						</>
					)}
				</>
			) : (
				<Wallets onSelected={(type) => updateWallet({ walletType: type })} />
			)}
		</div>
	);
};

export default Account;
