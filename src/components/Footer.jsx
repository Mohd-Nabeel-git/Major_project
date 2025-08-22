import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

const Footer = () => {
  return (
    <footer className="w-full bg-background text-foreground border-t border-border mt-auto flex-shrink-0">
      <Card className="w-full rounded-none border-none shadow-none bg-background text-foreground">
        <Separator />
        <CardContent className="flex flex-col md:flex-row items-center justify-between py-6 px-8 gap-8 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-2 text-muted-foreground md:gap-4">
            <span className="hidden md:inline">&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex flex-row gap-4 text-sm items-center">
            <a href="/about" className="hover:underline text-muted-foreground">About</a>
            <a href="/privacy" className="hover:underline text-muted-foreground">Privacy</a>
            <a href="/contact" className="hover:underline text-muted-foreground">Contact</a>
          </div>
          <div className="flex flex-row gap-3 items-center">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.89.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.75-1.56-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.41-5.27 5.7.42.36.8 1.08.8 2.18v3.24c0 .31.21.67.8.56C20.71 21.38 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56c-.89.39-1.84.65-2.84.77a4.93 4.93 0 0 0 2.16-2.72c-.95.56-2.01.97-3.13 1.19A4.92 4.92 0 0 0 16.67 3c-2.72 0-4.93 2.21-4.93 4.93 0 .39.04.77.12 1.13C7.69 8.86 4.07 7.13 1.64 4.16c-.43.74-.68 1.6-.68 2.52 0 1.74.89 3.28 2.25 4.18-.83-.03-1.61-.25-2.29-.63v.06c0 2.43 1.73 4.45 4.03 4.91-.42.12-.87.18-1.33.18-.32 0-.63-.03-.93-.09.63 1.97 2.45 3.4 4.6 3.44A9.87 9.87 0 0 1 0 19.54a13.94 13.94 0 0 0 7.56 2.22c9.05 0 14-7.5 14-14v-.64A9.94 9.94 0 0 0 24 4.56z"/></svg>
            </a>
            <a href="mailto:support@globalconnect.com" className="hover:text-primary">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 13.065l-8.4-6.3A1.2 1.2 0 0 1 4.8 4.8h14.4a1.2 1.2 0 0 1 .8 2.065l-8.4 6.2zm8.4 1.2V19.2a1.2 1.2 0 0 1-1.2 1.2H4.8a1.2 1.2 0 0 1-1.2-1.2v-4.935l8.4 6.3 8.4-6.3z"/></svg>
            </a>
          </div>
        </CardContent>
      </Card>
    </footer>
  );
};

export default Footer;
