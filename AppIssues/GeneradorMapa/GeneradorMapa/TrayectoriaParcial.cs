using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeneradorMapa
{
   public class TrayectoriaParcial
    {
       private float coste_;
       private int Nfinal_;
       private string recorrido_;
       private List<int> nodos_;

       public TrayectoriaParcial()
       {
           coste_ = 0;
           recorrido_ = null;
           nodos_ = new List<int>;
           Nfinal_ = -1;
       }

       public float get_coste() {return coste_;}
       public void set_coste(float c) { coste_ = c; }
       public int get_Nfinal() { return Nfinal_; }
       public void append(int nodo, string mov) { 
           Nfinal_ = nodo;
           recorrido_ += mov;
           nodos_.Add(nodo);
       }
       public string get_recorrido() { return recorrido_; }
       public List<int> get_nodos() { return nodos_; }
    }
}
