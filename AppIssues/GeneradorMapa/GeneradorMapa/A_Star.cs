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
        private static int ComparaCostes(TrayectoriaParcial x, TrayectoriaParcial y)
        {

            if (x.get_coste() == y.get_coste())
                return 0;
            else if (x.get_coste() < y.get_coste())
                return -1;
            else
                return 1;
        }
        public override void run() 
        {
            TrayectoriaParcial aux =null;
            int n;
            while (A_.Count != 0)
            {
                aux = A_[0];
                //Analizar primera trayectoria, si termina en objetivo terminar.
                if (aux.get_Nfinal() == (n = toNodo(robot_.get_meta().x, robot_.get_meta().y)))
                {
                    //Finalizar
                    A_.Clear();
                }
                else
                {
                    //De lo contrario: Borrarla e incluirla en la lista cerrada: void incluir_cerrada(Trayectoria)
                    A_.Remove(aux);
                    incluir_cerrada(aux);
                    //Ramificar la trayectoria eliminada de abierta
                    ramificar(aux);
                    //Añadir las nuevas trayectorias a la lista abierta
                    //Ordenar la abierta y eliminar con el mismo final tanto en abierta como en cerrada
                    A_.Sort(ComparaCostes);
                } 
           }

            robot_.get_trayectoria().set_trayectoria(aux.get_recorrido());

        }
        void incluir_cerrada(TrayectoriaParcial t)
        {
            bool insertar = true;

            for (int i = 0; i < C_.Count; i++)
            {
                if (C_[i].get_Nfinal() == t.get_Nfinal())
                {   //Si hay alguna con el mismo final eliminar la de mayor coste
                    if (C_[i].get_coste() > t.get_coste())
                    {
                        C_.RemoveAt(i);
                        
                        break;
                    }
                    else
                    {
                        insertar = false;
                        break;
                    }

                }
            }
            if (insertar)
                C_.Add(t); 
        }
        float funcion_estimadora(Posicion a) {
            Posicion aux = robot_.get_meta();
            return (Math.Abs(aux.x - a.x) + Math.Abs(aux.y - a.y));
        }
        void ramificar(TrayectoriaParcial t)
        {
            List<TrayectoriaParcial> nuevas = new List<TrayectoriaParcial>();

            robot_.set_pos(toPosicion(t.get_Nfinal()));
            robot_.actualizarSensores();

            if (robot_.get_sensores()[(int)Direcciones.NORTE] == 0 || robot_.get_sensores()[(int)Direcciones.NORTE] == 2)
            {
                nuevas.Add(new TrayectoriaParcial(t));
                nuevas[nuevas.Count - 1].append(toNodo(robot_.get_pos()) - 1, "N");
                //Funciona solo porque el coste de trancitar entre nodos es constante.
                nuevas[nuevas.Count - 1].set_coste((t.get_recorrido().Length - 1) + funcion_estimadora(new Posicion (robot_.get_pos().x, robot_.get_pos().y - 1)) + 1);
            }
            if (robot_.get_sensores()[(int)Direcciones.SUR] == 0 || robot_.get_sensores()[(int)Direcciones.SUR] == 2)
            {
                nuevas.Add(new TrayectoriaParcial(t));
                nuevas[nuevas.Count - 1].append(toNodo(robot_.get_pos()) + 1, "S");
                nuevas[nuevas.Count - 1].set_coste((t.get_recorrido().Length - 1) + funcion_estimadora(new Posicion(robot_.get_pos().x, robot_.get_pos().y + 1)) + 1);
            }
            if (robot_.get_sensores()[(int)Direcciones.ESTE] == 0 || robot_.get_sensores()[(int)Direcciones.ESTE] == 2)
            {
                nuevas.Add(new TrayectoriaParcial(t)); 
                nuevas[nuevas.Count - 1].append(toNodo(robot_.get_pos()) + robot_.get_parent().get_tab().get_columns(), "E");
                nuevas[nuevas.Count - 1].set_coste((t.get_recorrido().Length - 1) + funcion_estimadora(new Posicion(robot_.get_pos().x + 1, robot_.get_pos().y)) + 1);
            }
            if (robot_.get_sensores()[(int)Direcciones.OESTE] == 0 || robot_.get_sensores()[(int)Direcciones.OESTE] == 2)
            {
                nuevas.Add(new TrayectoriaParcial(t));
                nuevas[nuevas.Count - 1].append(toNodo(robot_.get_pos()) - robot_.get_parent().get_tab().get_columns(), "O"); 
                nuevas[nuevas.Count - 1].set_coste((t.get_recorrido().Length - 1) + funcion_estimadora(new Posicion(robot_.get_pos().x - 1, robot_.get_pos().y)) + 1);
            }

            nuevas.ForEach(delegate(TrayectoriaParcial aux)
            {
                bool ok = true;
                bool insertar = false;
                //Si esta en la cerrada entonces a borrala!
                for (int i = 0; i < C_.Count; i++)
                {
                    if (C_[i].get_Nfinal() == aux.get_Nfinal())
                    {
                        ok = false;
                        break;
                    }
                }
                if (ok)
                {
                    insertar = true;
                    //Si no esta en la cerrada, ver si esta en la abierta
                    for (int i = 0; i < A_.Count; i++)
                    {
                        if (A_[i].get_Nfinal() == aux.get_Nfinal())
                        {
                            if (A_[i].get_coste() > aux.get_coste())                            
                                A_.RemoveAt(i);                          
                            else                           
                                insertar = false;
                            break;
                        }
                    }
                    if (insertar)
                    {
                        A_.Add(aux);
                    }
                }
            });

        }


    }
}
