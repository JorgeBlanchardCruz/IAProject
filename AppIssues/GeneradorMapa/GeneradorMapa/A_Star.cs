using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeneradorMapa
{
    public class A_Star: Method
    {
        private List<TrayectoriaParcial> A_;
        private List<TrayectoriaParcial> C_;

        public A_Star(Robot r)
            : base(r)
        {
            TrayectoriaParcial aux;
            aux = new TrayectoriaParcial();


            aux.append(toNodo(robot_.get_pos()), "-");

            A_ = new List<TrayectoriaParcial> ();
            C_ = new List<TrayectoriaParcial> ();

            A_.Add(aux);
        }

        public void ramificar(TrayectoriaParcial t)
        {

        }
        public override void run() 
        {
            while (A_.Count != 0)
            {
                //Analizar primera trayectoria, si termina en objetivo terminar.
                //De lo contrario: Borrarla e incluirla en la lista cerrada: void incluir_cerrada(Trayectoria)
                //Ramificar la trayectoria eliminada de abierta
                //Añadir las nuevas trayectorias a la lista abierta
                //Ordenar la abierta y eliminar con el mismo final tanto en abierta como en cerrada
            }


        }


    }
}
