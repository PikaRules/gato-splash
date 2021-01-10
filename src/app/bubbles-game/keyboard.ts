
export class Keyboard {

    private clearMethod: Function;
    private callback: (key: string) => void;

    public startListening(callback: (key: string) => void) {
        if ( this.clearMethod ) {
            this.clearMethod();
            this.clearMethod = null;
        }
        this.callback = callback;
        const bindedMethod = this.downListener.bind(this) as (event: KeyboardEvent) => void;
        window.addEventListener('keydown', bindedMethod, false);
        this.clearMethod = () => {
            window.removeEventListener('keydown', bindedMethod);
        };
    }

    public stop() {
        if ( this.clearMethod ) {
            this.clearMethod();
            this.clearMethod = null;
        }
        this.callback = null;
    }

    private downListener(event: KeyboardEvent) {
        this.callback(event.key);
    }
}
