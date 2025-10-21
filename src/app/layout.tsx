
import WalletProviderComponent from './providers';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProviderComponent>{children}</WalletProviderComponent>
      </body>
    </html>
  );
}