export const SectionItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 group">
        <div className="p-2 rounded-md bg-spurple/10 group-hover:bg-spurple/15 transition-colors">
            <Icon className="w-5 h-5 text-spurple" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-0.5 uppercase tracking-wider">{label}</p>
            <p className="text-sm text-primary font-medium break-words">{value || '—'}</p>
        </div>
    </div>
);
