import { GlobalContextProvider } from "@/containers/GlobalContext";
import "./globals.css";
import NavBar from "@/components/Navbar/index";
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
    title: "DevCollab",
};

export default function RootLayout({ children }) {

    return (
        <html lang="en" className="dark">
            <body>
                <GlobalContextProvider>
                    <div className="w-full h-full flex">
                        <NavBar />
                        {children}
                    </div>
                </GlobalContextProvider>
                <Toaster />
            </body>
        </html>
    );
}
