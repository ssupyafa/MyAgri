import React from 'react'

const PredictionForm = ({ title, fields, onSubmit, loading }) => {
  return (
    <div className="glass-morphism rounded-2xl p-8 border border-white/5 h-full">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-1.5 h-6 bg-primary rounded-full"></div>
        <h3 className="text-xl font-display font-semibold">{title}</h3>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.name} className="flex flex-col gap-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-1">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-gray-600"
                required
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-primary text-background font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_0_20px_rgba(132,204,22,0.2)]"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              EXECUTE MODEL ANALYSIS
              <div className="w-5 h-5 rounded-md bg-background/10 flex items-center justify-center transition-transform group-hover:translate-x-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default PredictionForm