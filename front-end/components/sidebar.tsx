function Sidebar() {
    return (
            <aside className="sidebar">

                <div className="logo">
                    Caderno<span>Açaí</span>
                </div>

                <nav>
                    <a href="/escala">
                        <span className="icone-sidebar">📅</span>
                        Escala
                    </a>

                    <a href="/pessoas">
                        <span className="icone-sidebar">👥</span>
                        Pessoas
                    </a>

                    <a href="/produtos">
                        <span className="icone-sidebar">📦</span>
                        Produtos
                    </a>
                    
                    <a href="/maquinas">
                        <span className="icone-sidebar"></span>
                        Máquinas
                    </a>
                </nav>
            </aside>
    );
}

export default Sidebar;