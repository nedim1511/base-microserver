import contextService from 'request-context';

export class Context {
    private id
    private accountId;

    constructor(id) {
        this.id = id;
    }

    static get(): Context {
        const context: Context = contextService.get('request:context');
        return context;
    }

    static getAccountId() {
        return Context.get()!.accountId;
    }

    static setAccountId(accountId) {
        Context.get().accountId = accountId;
    }
}