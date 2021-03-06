import Container from "./container";
import { EXAMPLE_PATH } from "../lib/constants";

export default function Footer() {
    return (
        <footer className="bg-green-500 border-t border-accent-2">
            <Container>
                <div className="py-28 flex flex-col lg:flex-row items-center">
                    <div className="flex flex-col lg:flex-row justify-center lg:mb-0 lg:pl-4 lg:w-1/2"></div>
                    <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
                        <a
                            href="https://nextjs.org/docs/basic-features/pages"
                            className="mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
                        >
                            Read Documentation
                        </a>
                        <a
                            href={`https://github.com/baokhoavu/baolog`}
                            className="mx-3 font-bold hover:underline"
                        >
                            View on GitHub
                        </a>
                    </div>
                    <div className="flex flex-col lg:flex-row justify-center lg:mb-0 lg:pl-4 lg:w-1/2"></div>
                </div>
            </Container>
        </footer>
    );
}
