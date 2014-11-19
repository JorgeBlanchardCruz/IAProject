using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeneradorMapa
{
    public class Trayectoria
    {
        private string trayectoria_;
        private int dir_;

        public Trayectoria()
        {
            trayectoria_ = null;
            dir_ = (int)Direcciones.NORTE;
        }
        public void move_Norte()
        {
            switch (dir_)
            {
                case (int)Direcciones.NORTE: trayectoria_ += "w"; break;
                case (int)Direcciones.SUR: trayectoria_ += "a" + "a" + "w"; break;
                case (int)Direcciones.ESTE: trayectoria_ += "a" + "w"; break;
                case (int)Direcciones.OESTE: trayectoria_ += "d" + "w"; break;
            }
            dir_ = (int)Direcciones.NORTE;
        }

        public void move_Sur()
        {
            switch (dir_)
            {
                case (int)Direcciones.NORTE: trayectoria_ += "a" + "a" + "w"; break;
                case (int)Direcciones.SUR: trayectoria_ += "w"; break;
                case (int)Direcciones.ESTE: trayectoria_ += "d" + "w"; break;
                case (int)Direcciones.OESTE: trayectoria_ += "a" + "w"; break;
            }
            dir_ = (int)Direcciones.SUR;
        }
        public void move_Este()
        {
            switch (dir_)
            {
                case (int)Direcciones.NORTE: trayectoria_ += "d" + "w"; break;
                case (int)Direcciones.SUR: trayectoria_ += "a" + "w"; break;
                case (int)Direcciones.ESTE: trayectoria_ += "w"; break;
                case (int)Direcciones.OESTE: trayectoria_ += "a" + "a" + "w"; break;
            }
            dir_ = (int)Direcciones.ESTE;
        }
        public void move_Oeste()
        {
            switch (dir_)
            {
                case (int)Direcciones.NORTE: trayectoria_ += "a" + "w"; break;
                case (int)Direcciones.SUR: trayectoria_ += "d" + "w"; break;
                case (int)Direcciones.ESTE: trayectoria_ += "a" + "a" + "w"; break;
                case (int)Direcciones.OESTE: trayectoria_ +=  "w"; break;
            }
            dir_ = (int)Direcciones.OESTE;
        }
    }
}
