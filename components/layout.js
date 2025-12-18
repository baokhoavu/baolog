import Alert from "../components/alert";
import Footer from "../components/footer";
import Meta from "../components/meta";

export default function Layout({ preview, children }) {
    return (
        <>
            <Meta />
            <div className="min-h-screen flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12">
                {/* <Alert preview={preview} /> */}
                <main>{children}</main>
            </div>
            <Footer />
        </>
    );
}
